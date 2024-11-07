import {
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { UserService } from '../user/user.service';
//   import { ConfigService } from '@nestjs/config';
  import * as bcrypt from 'bcrypt';
  import { CreateUserDto } from './dto/create-user.dto';
  import { EnvironmentVariables } from '@/common/config/environment-variables';
  import { ConfirmDto, SetActivateDto } from './dto/confirm.dto';
  import { ResendCodeDto } from './dto/resend-code.dto';
  import { SignInAPIDto, SignInDto } from './dto/sign-in.dto';
  import { RequestResetPasswordDto } from './dto/request-password-reset.dto';
  import { ResetPasswordDto } from './dto/reset-password.dto';
  import { User } from '../user/user.entity';
//   import speakeasy from 'speakeasy';
  import { EnableTwoFaDto } from './dto/enable-two-fa.dto';
  import { UpdatePasswordDto } from './dto/update-password.dto';
  import { RoleService } from '../role/role.service';
//   import { EncryptionService } from '../encryption/encryption.service';
//   import { EmailNotificationService } from '../email-notification/email-notification.service';
  import * as fs from 'fs';
//   import * as handlebars from 'handlebars';
  import * as path from 'path';
  import { ProfileType } from 'src/utils/enums';
import { SessionService } from '../session/session.service';
//   import { ProfileRepository } from '../profile/profile.repository';
//   import { ApiKeyRepository } from '../api-key/api-key.repository';
  
  @Injectable()
  export class AuthenticationService {
    constructor(
      private readonly userService: UserService,
    //   private readonly configService: ConfigService<EnvironmentVariables, true>,
      private readonly sessionService: SessionService,
    //   private readonly profileRepository: ProfileRepository,
    //   private readonly apiKeyRepository: ApiKeyRepository,
    //   private readonly encryptionService: EncryptionService,
    //   private readonly emailNotificationService: EmailNotificationService
    ) {}
  
    async signUpUser(userDto: CreateUserDto) {
      try {
            // const defaultProfile = await this.profileRepository.findOne({
            // where: {
            //     type: ProfileType.CLIENT,
            //     shortName: 'owner',
            // },
            // });
    
            // if (!defaultProfile) {
            // throw new NotFoundException({
            //     message: 'You cannot sign up at the moment',
            // });
            // }
  
        const user = await this.userService.create({
          ...userDto,
          password: await bcrypt.hash(userDto.password, await bcrypt.genSalt()),
          isActive: false,
        });
  
        return user
      } catch (e) {
        if (e.code === 11000) {
          throw new ConflictException({
            message: 'User or client already exists',
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
          throw new UnauthorizedException('Unauthorized', {
            cause: 'Invalid password',
          });
        }
    
        // if (user.isTwoFaEnabled) {
        //   if (!sigInDto.twoFaCode) {
        //     throw new UnauthorizedException(
        //       'Two factor authentication code is required',
        //       {
        //         description: "Property 'twoFaCode' is required",
        //       },
        //     );
        //   }
    
        //   await this.verifyTwoFaCode(user, sigInDto.twoFaCode);
        // }
    
        // if (!user.isEmailAddressVerified || !user.isActive) {
        //   throw new UnauthorizedException('Unauthorized', {
        //     cause: 'User is not active or email address is not verified',
        //   });
        // }
    
        return {
          sessionId: await this.sessionService.createSession(user.username),
          user,
        };
      }
      
//     async confirm(confirmDto: ConfirmDto) {
//       const user = await this.userService.getByUsernameOrEmailAddress(
//         confirmDto.emailAddress,
//       );
//       await this.confirmationCodeService.verify(
//         user,
//         confirmDto.code,
//         ConfirmationCodeType.EMAIL_CONFIRMATION,
//       );
  
//       return await this.userService.create({
//         ...user,
//         isActive: true,
//         isEmailAddressVerified: true,
//       });
//     }
  
//     async resendCode(resendCodeDto: ResendCodeDto) {
//       const user = await this.userService.getByUsernameOrEmailAddress(
//         resendCodeDto.emailAddress,
//       );
//       if (user.isEmailAddressVerified) {
//         throw new ForbiddenException('Email address is already verified');
//       }
  
//       const confirmationCode = await this.confirmationCodeService.generate(
//         user,
//         ConfirmationCodeType.EMAIL_CONFIRMATION,
//       );
  
//       const emailTitle = 'Activa tu cuenta';
//       const filePath = path.join(__dirname, '..', '..', 'utils', 'email-templates')
//       const templateSource = fs.readFileSync(`${filePath}/new-user.html`, 'utf-8');
//       const template = handlebars.compile(templateSource);
//       const htmlContent = template({
//         title: emailTitle,
//         headerTitle: emailTitle,
//         mainContent: `Estás a un paso de activar tu cuenta. Para confirmar tu correo electrónico y configurar tu contraseña, haz clic en el siguiente enlace:`,
//         actionLink: `${this.configService.get('FRONTEND_HOST')}/confirm?emailAddress=${user.emailAddress}&code=${confirmationCode.code}`,
//         actionLinkText: 'Activar cuenta',
//         currentYear: new Date().getFullYear(),
//       });
  
//       await this.emailNotificationService.create({
//         recipient: user,
//         subject: emailTitle,
//         body: htmlContent
//       })
//     }
  
   
  
//     async signInWithAPI(signInAPIDto: SignInAPIDto) {
//       const apiKey = await this.apiKeyRepository.findOne({
//         where: {
//           apiKey: signInAPIDto.apiKey,
//         },
//         relations: {
//           user: {
//             profiles: true,
//           },
//         },
//       });
//       if (!apiKey) {
//         throw new UnauthorizedException('Invalid API key', {
//           cause: 'Invalid API key',
//         });
//       }
//       if (!apiKey.user || !apiKey.user.id) {
//         throw new UnauthorizedException('Invalid API key', {
//           cause: 'Invalid API key',
//         });
//       }
//       const user = await this.userService.findById(apiKey.user.id!);
  
//       if (!user.isEmailAddressVerified || !user.isActive) {
//         throw new UnauthorizedException('Invalid API key', {
//           cause: 'Invalid API key or not active',
//         });
//       }
  
//       return {
//         sessionId: await this.sessionService.createSession({
//           ...user,
//           password: '',
//           twoFaSeed: '',
//         }),
//         user,
//       };
//     }
  
//     async requestPasswordReset(requestPasswordResetDto: RequestResetPasswordDto) {
//       const user = await this.userService.getByUsernameOrEmailAddress(
//         requestPasswordResetDto.username || requestPasswordResetDto.emailAddress!,
//       );
//       const confirmationCode = await this.confirmationCodeService.generate(
//         user,
//         ConfirmationCodeType.PASSWORD_RESET,
//       );
  
//       await this.emailNotificationService.create({
//         recipient: user,
//         subject: 'Password Reset Code',
//         body: `
//             <a href="${this.configService.get('FRONTEND_HOST')}/reset-password?emailAddress=${user.emailAddress}&username=${user.username}&code=${confirmationCode.code}">
//               Click here to reset your password
//             </a>
//           `
//       })
//     }
  
//     async resetPasswordDto(resetPasswordDto: ResetPasswordDto) {
//       const user = await this.userService.getByUsernameOrEmailAddress(
//         resetPasswordDto.username || resetPasswordDto.emailAddress!,
//       );
//       await this.confirmationCodeService.verify(
//         user,
//         resetPasswordDto.code,
//         ConfirmationCodeType.PASSWORD_RESET,
//       );
  
//       return await this.userService.create({
//         ...user,
//         password: await bcrypt.hash(
//           resetPasswordDto.newPassword,
//           await bcrypt.genSalt(),
//         ),
//       });
//     }
  
//     async generateTwoFactorSecret(user: EntityWithId<User>, sessionId: string) {
//       if (user.twoFaSeed) {
//         return {
//           secret: user.twoFaSeed,
//           otpAuthUrl: speakeasy.otpauthURL({
//             label: user.username,
//             secret: user.twoFaSeed,
//             issuer: 'Account Provider V2',
//             type: 'totp',
//             encoding: 'ascii',
//           }),
//         };
//       }
  
//       const secret = speakeasy.generateSecret({
//         name: user.username,
//         issuer: 'Account Provider V2',
//       });
//       const otpAuthUrl = speakeasy.otpauthURL({
//         label: user.username,
//         secret: secret.ascii,
//         issuer: 'Account Provider V2',
//         type: 'totp',
//         encoding: 'ascii',
//       });
  
//       await this.userService.updateById(user.id, { twoFaSeed: secret.ascii }, sessionId);
  
//       return {
//         secret: secret.ascii,
//         otpAuthUrl,
//       };
//     }
  
//     async enableTwoFactorSecret(
//       user: EntityWithId<User>,
//       enableTwoFaDto: EnableTwoFaDto,
//       sessionId: string,
//     ) {
//       await this.verifyTwoFaCode(user, enableTwoFaDto.twoFaCode);
  
//       await this.userService.updateById(
//         user.id,
//         {
//           isTwoFaEnabled: true,
//         },
//         sessionId,
//       );
//     }
  
//     async verifyTwoFaCode(user: User, code: string) {
//       if (!user.twoFaSeed) {
//         throw new UnauthorizedException(
//           'Invalid two factor authentication codexxxx',
//           {
//             cause: 'User does not have two factor authentication secret',
//           },
//         );
//       }
  
//       const result = speakeasy.totp.verify({
//         secret: user.twoFaSeed,
//         encoding: 'ascii',
//         token: code,
//         window: 6,
//       });
//       if (!result) {
//         throw new UnauthorizedException('Invalid two factor authentication code');
//       }
  
//       return true;
//     }
  
//     async logOut(sessionId: string) {
//       await this.sessionService.deleteSession(sessionId);
//     }
  
//     async updatePassword(
//       user: EntityWithId<User>,
//       updatePasswordDto: UpdatePasswordDto,
//       sessionId: string,
//     ) {
//       await this.verifyTwoFaCode(user, updatePasswordDto.twoFaCode);
  
//       if (
//         !(await bcrypt.compare(updatePasswordDto.currentPassword, user.password))
//       ) {
//         throw new UnauthorizedException('Unauthorized', {
//           cause: 'Invalid password',
//         });
//       }
  
//       await this.userService.updateById(
//         user.id,
//         {
//           password: await bcrypt.hash(
//             updatePasswordDto.newPassword,
//             await bcrypt.genSalt(),
//           ),
//         },
//         sessionId,
//       );
//     }
  
//     async regenerateMasterKey(
//       user: EntityWithId<User>,
//       sessionId: string,
//     ) {
//       try {
//         const foundUser = await this.userService.getByUsernameOrEmailAddress(
//           user.username || user.emailAddress!,
//         );
  
//         const { publicKey, privateKey } = await this.encryptionService.generateKeys();
//         const masterKey = await this.encryptionService.generateMasterKey();
  
//         const encryptedCPrivateKey = await this.encryptionService.encryptPrivateKey(
//           privateKey,
//           masterKey)
  
//         await this.clientService.updateClientByKeys(
//           foundUser?.client?.id!,
//           publicKey,
//           encryptedCPrivateKey,
//           sessionId
//         )
//         return masterKey;
//       } catch (e) {
//         if (e.code === PG_UNIQUE_VIOLATION) {
//           throw new ConflictException({
//             message: 'User or client already exists',
//           });
//         }
//         throw e;
//       }
//     }
  
//     async setPassActivateUser(setActivateDto: SetActivateDto) {
//       const user = await this.userService.getByUsernameOrEmailAddress(
//         setActivateDto.emailAddress,
//       );
//       await this.confirmationCodeService.verify(
//         user,
//         setActivateDto.code,
//         ConfirmationCodeType.EMAIL_ACTIVATION,
//       );
  
//       return await this.userService.create({
//         ...user,
//         isActive: true,
//         isEmailAddressVerified: true,
//         password: await bcrypt.hash(
//           setActivateDto.password,
//           await bcrypt.genSalt(),
//         ),
//       });
//     }
//   }
}