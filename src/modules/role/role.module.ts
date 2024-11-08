import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/profile.entity';
import { Role } from './role.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Role], MONGODB_CONNEXION_NAME)
  ],
  controllers: [RoleController],
  providers: [RoleService]
})
export class RoleModule {}
