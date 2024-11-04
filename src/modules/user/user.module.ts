import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User], MONGODB_CONNEXION_NAME)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports:[UserService]
})
export class UserModule {}
