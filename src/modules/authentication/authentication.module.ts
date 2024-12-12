import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from '../profile/profile.module';
import { AuthenticationTwoFaController } from './controllers/authentication-two-fa.controller';
import { ConfirmationCodeModule } from '../confirmation-code/confirmation-code.module';
import { EmailModule } from '../email/email.module';
import { AuthenticationCodeController } from './controllers/authentication-code.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    PassportModule,
    ProfileModule,
    ConfirmationCodeModule,
    EmailModule,
  ],
  controllers: [
    AuthenticationController,
    AuthenticationTwoFaController,
    AuthenticationCodeController,
  ],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
