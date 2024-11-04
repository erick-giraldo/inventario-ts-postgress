import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { SessionModule } from '../session/session.module';
import { UserModule } from '../user/user.module';

@Module({
  imports:[ UserModule, SessionModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService]
})
export class AuthenticationModule {}
