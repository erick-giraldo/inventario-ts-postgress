import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { ProfileModule } from '../profile/profile.module';
import { AuthenticationTwoFaController } from './authentication-two-fa.controller';
import { ConfirmationCodeModule } from '../confirmation-code/confirmation-code.module';

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
    ConfirmationCodeModule
  ],
  controllers: [AuthenticationController, AuthenticationTwoFaController],
  providers: [AuthenticationService, JwtStrategy],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
