import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session], MONGODB_CONNEXION_NAME)],
  providers: [SessionService, SessionRepository],
  exports:[SessionService]
})
export class SessionModule {}
