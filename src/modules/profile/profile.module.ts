import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { RoleModule } from '../role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile], MONGODB_CONNEXION_NAME),
    RoleModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileRepository],
})
export class ProfileModule {}
