import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ProfileType } from 'src/utils/enums';
import { ProfileRepository } from '../profile/profile.repository';
import { EnvironmentVariables } from '@/common/config/environment-variables';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import speakeasy from 'speakeasy';
import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { EntityWithId } from '@/common/types/types';
import { EnableTwoFaDto } from './dto/enable-two-fa.dto';
import { ConfirmationCodeType } from '../confirmation-code/confirmation-code-type.enum';
import { ConfirmationCodeService } from '../confirmation-code/confirmation-code.service';
import { EmailService } from '../email/email.service';
import { ConfirmDto, SetActivateDto } from './dto/confirm.dto';
import { ResendCodeDto } from './dto/resend-code.dto';
import { SessionService } from '../session/session.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly profileRepository: ProfileRepository,
    private readonly confirmationCodeService: ConfirmationCodeService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly sessionService: SessionService,
  ) {}

  async signUpUser(userDto: CreateUserDto) {
    if (!this.configService.get('USER_REGISTER')) {
      throw new NotFoundException(
        {
          message: 'Module is disabled',
        },
        {
          cause: 'Module is disabled',
        },
      );
    }

    try {
      const defaultProfile = await this.profileRepository.findOne({
        where: {
          type: ProfileType.USER,
          shortName: 'owner',
        },
      });

      if (!defaultProfile) {
        throw new NotFoundException({
          message: 'You cannot sign up at the moment',
        });
      }

      const user = await this.userService.create({
        ...userDto,
        profiles: [defaultProfile],
        password: await bcrypt.hash(userDto.password, await bcrypt.genSalt()),
        isActive: false,
      });

      const confirmationCode = await this.confirmationCodeService.generate(
        user,
        ConfirmationCodeType.EMAIL_CONFIRMATION,
      );

      const emailTitle = 'Activa tu cuenta';
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'assets',
        'email-templates',
      );
      const templateSource = fs.readFileSync(
        `${filePath}/new-user.html`,
        'utf-8',
      );
      const template = handlebars.compile(templateSource);
      const htmlContent = template({
        title: emailTitle,
        headerTitle: emailTitle,
        mainContent: `Estás a un paso de activar tu cuenta. Para confirmar tu correo electrónico y configurar tu contraseña, haz clic en el siguiente enlace:`,
        actionLink: `${this.configService.get('FRONTEND_HOST')}/code/confirm?emailAddress=${user.emailAddress}&code=${confirmationCode.code}`,
        actionLinkText: 'Activar cuenta',
        currentYear: new Date().getFullYear(),
      });

      await this.emailService.sendEmailBrevo({
        recipient: user,
        subject: emailTitle,
        body: htmlContent,
      });

      return user;
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: `User already exists, ${duplicateKey} is duplicated`,
        });
      }
      throw e;
    }
  }

  async signIn(sigInDto: SignInDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      sigInDto.username || sigInDto.emailAddress!,
    );
    const isPasswordValid = await bcrypt.compare(
      sigInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    if (user.isTwoFaEnabled) {
      if (!sigInDto.twoFaCode) {
        throw new UnauthorizedException(
          'Two factor authentication code is required',
          {
            description: "Property 'twoFaCode' is required",
          },
        );
      }

      await this.verifyTwoFaCode(user, sigInDto.twoFaCode);
    }
    if (!user.isEmailAddressVerified || !user.isActive) {
      throw new UnauthorizedException('Unauthorized', {
        description: 'User is not active or email address is not verified',
      });
    }

    return {
      sessionId: await this.sessionService.createSession(user),
      user,
    };
  }

  async generateTwoFactorSecret(user: EntityWithId<User>, sessionId: string) {
    if (user.twoFaSeed) {
      return {
        secret: user.twoFaSeed,
        otpAuthUrl: speakeasy.otpauthURL({
          label: user.username,
          secret: user.twoFaSeed,
          issuer: 'Account Provider V2',
          type: 'totp',
          encoding: 'ascii',
        }),
      };
    }

    const secret = speakeasy.generateSecret({
      name: user.username,
      issuer: 'Account Provider V2',
    });
    const otpAuthUrl = speakeasy.otpauthURL({
      label: user.username,
      secret: secret.ascii,
      issuer: 'Account Provider V2',
      type: 'totp',
      encoding: 'ascii',
    });

    await this.userService.updateById(
      user.id,
      { twoFaSeed: secret.ascii },
      sessionId,
    );

    return {
      secret: secret.ascii,
      otpAuthUrl,
    };
  }

  async enableTwoFactorSecret(
    user: EntityWithId<User>,
    enableTwoFaDto: EnableTwoFaDto,
    sessionId: string,
  ) {
    await this.verifyTwoFaCode(user, enableTwoFaDto.twoFaCode);

    await this.userService.updateById(
      user.id,
      {
        isTwoFaEnabled: true,
      },
      sessionId,
    );
  }

  async verifyTwoFaCode(user: User, code: string) {
    if (!user.twoFaSeed) {
      throw new UnauthorizedException(
        'Invalid two factor authentication codexxxx',
        {
          description: 'User does not have two factor authentication secret',
        },
      );
    }

    const result = speakeasy.totp.verify({
      secret: user.twoFaSeed,
      encoding: 'ascii',
      token: code,
      window: 6,
    });
    if (!result) {
      throw new UnauthorizedException('Invalid two factor authentication code');
    }

    return true;
  }

  async confirm(confirmDto: ConfirmDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      confirmDto.emailAddress,
    )
    await this.confirmationCodeService.verify(
      user,
      confirmDto.code,
      ConfirmationCodeType.EMAIL_CONFIRMATION,
    );
    return await this.userService.updateById(String(user.id), {
      isActive: true,
      isEmailAddressVerified: true,
    });
  }

  async setPassActivateUser(setActivateDto: SetActivateDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      setActivateDto.emailAddress,
    )
    await this.confirmationCodeService.verify(
      user,
      setActivateDto.code,
      ConfirmationCodeType.EMAIL_ACTIVATION,
    );

    return await this.userService.updateById(String(user.id), {
      isActive: true,
      isEmailAddressVerified: true,
      password: await bcrypt.hash(
        setActivateDto.password,
        await bcrypt.genSalt(),
      ),
    });
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      resendCodeDto.emailAddress,
    );
    if (user.isEmailAddressVerified) {
      throw new ForbiddenException('Email address is already verified');
    }

    const confirmationCode = await this.confirmationCodeService.generate(
      user,
      ConfirmationCodeType.EMAIL_CONFIRMATION,
    );

    const emailTitle = 'Activa tu cuenta';
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'assets',
      'email-templates',
    );
    const templateSource = fs.readFileSync(
      `${filePath}/new-user.html`,
      'utf-8',
    );
    const template = handlebars.compile(templateSource);
    const htmlContent = template({
      title: emailTitle,
      headerTitle: emailTitle,
      mainContent: `Estás a un paso de activar tu cuenta. Para confirmar tu correo electrónico y configurar tu contraseña, haz clic en el siguiente enlace:`,
      actionLink: `${this.configService.get('FRONTEND_HOST')}/code/confirm?emailAddress=${user.emailAddress}&code=${confirmationCode.code}`,
      actionLinkText: 'Activar cuenta',
      currentYear: new Date().getFullYear(),
    });

    await this.emailService.sendEmailBrevo({
      recipient: user,
      subject: emailTitle,
      body: htmlContent,
    });
  }

  async logOut(sessionId: string) {
    await this.sessionService.deleteSession(sessionId);
  }

  
  async updatePassword(
    user: EntityWithId<User>,
    updatePasswordDto: UpdatePasswordDto,
    sessionId: string,
  ) {
    await this.verifyTwoFaCode(user, updatePasswordDto.twoFaCode);

    if (
      !(await bcrypt.compare(updatePasswordDto.currentPassword, user.password))
    ) {
      throw new UnauthorizedException('Unauthorized', {
        cause: 'Invalid password',
      });
    }

    await this.userService.updateById(
      user.id,
      {
        password: await bcrypt.hash(
          updatePasswordDto.newPassword,
          await bcrypt.genSalt(),
        ),
      },
      sessionId,
    );
  }

}
