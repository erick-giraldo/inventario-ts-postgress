import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ProfileType } from 'src/utils/enums';
import { ProfileRepository } from '../profile/profile.repository';
import { EnvironmentVariables } from '@/common/config/environment-variables';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import speakeasy from 'speakeasy';
import { EntityWithId } from '@/common/types/types';
import { EnableTwoFaDto } from './dto/enable-two-fa.dto';
import { IUser } from '../user/user.interface';
import { UserType } from '../user/user-type.enum';
import { ConfirmationCodeType } from '../confirmation-code/confirmation-code-type.enum';
import { ConfirmationCodeService } from '../confirmation-code/confirmation-code.service';
@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
    private readonly confirmationCodeService: ConfirmationCodeService,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
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
        profiles: [defaultProfile.id!],
        password: await bcrypt.hash(userDto.password, await bcrypt.genSalt()),
        isActive: false,
        isEmailAddressVerified: false,
        isTwoFaEnabled: false,
        userType: UserType.USER,
      });

      await this.confirmationCodeService.generate(
        String(user._id),
        ConfirmationCodeType.EMAIL_CONFIRMATION,
      );

      return user;
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: 'User already exists',
          duplicateKey,
        });
      }
      throw e;
    }
  }

  async signIn(sigInDto: SignInDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      sigInDto.emailAddress!,
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

    const payload = {
      id: user.id,
      username: user.username,
      isActive: user.isActive,
      isEmailAddressVerified: user.isEmailAddressVerified,
      profiles: user.profiles,
      isTwoFaEnabled: false,
      twoFaSeed: user.twoFaSeed,
    };
    return {
      token: await this.jwtService.signAsync(payload),
      user,
    };
  }

  async generateTwoFactorSecret(user: EntityWithId<User>) {
    if (user.twoFaSeed) {
      return {
        secret: user.twoFaSeed,
        otpAuthUrl: speakeasy.otpauthURL({
          label: user.username,
          secret: user.twoFaSeed,
          issuer: 'Inventario TS V1',
          type: 'totp',
          encoding: 'ascii',
        }),
      };
    }

    const secret = speakeasy.generateSecret({
      name: user.username,
      issuer: 'Inventario TS V1',
    });
    const otpAuthUrl = speakeasy.otpauthURL({
      label: user.username,
      secret: secret.ascii,
      issuer: 'Inventario TS V1',
      type: 'totp',
      encoding: 'ascii',
    });

    await this.userService.updateById(user.id, { twoFaSeed: secret.ascii });

    const payload = {
      id: user.id,
      username: user.username,
      isActive: user.isActive,
      isEmailAddressVerified: user.isEmailAddressVerified,
      profiles: user.profiles,
      isTwoFaEnabled: false,
      twoFaSeed: secret.ascii,
    };
  
    return {
      secret: secret.ascii,
      otpAuthUrl,
      token: await this.jwtService.signAsync(payload),
    };
  }

  async enableTwoFactorSecret(user: IUser, enableTwoFaDto: EnableTwoFaDto) {
    await this.verifyTwoFaCode(user, enableTwoFaDto.twoFaCode);

    await this.userService.updateById(String(user.id), {
      isTwoFaEnabled: true,
    });

    const payload = {
      id: user.id,
      username: user.username,
      isActive: user.isActive,
      isEmailAddressVerified: user.isEmailAddressVerified,
      profiles: user.profiles,
      isTwoFaEnabled: true,
      twoFaSeed: user.twoFaSeed,
    };
  
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async verifyTwoFaCode(user: IUser, code: string) {
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
}
