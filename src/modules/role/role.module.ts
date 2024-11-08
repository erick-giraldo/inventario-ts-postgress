import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { RoleRepository } from './role.repository';
import { Role } from './role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role], MONGODB_CONNEXION_NAME)],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
  exports: [RoleRepository],
})
export class RoleModule {}
