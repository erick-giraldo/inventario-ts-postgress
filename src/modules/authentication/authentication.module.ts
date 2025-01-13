import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from '../profile/profile.module';
import { AuthenticationTwoFaController } from './controllers/authentication-two-fa.controller';
import { ConfirmationCodeModule } from '../confirmation-code/confirmation-code.module';
import { EmailModule } from '../email/email.module';
import { AuthenticationCodeController } from './controllers/authentication-code.controller';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '../session/session.module';
import { ProfileRepository } from '../profile/profile.repository';

@Module({
  imports: [
    UserModule,
    PassportModule,
    ProfileModule,
    ConfirmationCodeModule,
    EmailModule,
    ConfigModule,
    SessionModule,
  ],
  controllers: [
    AuthenticationController,
    AuthenticationTwoFaController,
    AuthenticationCodeController,
  ],
  providers: [AuthenticationService, ProfileRepository],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
