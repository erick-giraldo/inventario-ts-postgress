import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { Profile } from './profile.entity';
import { Role } from '../role/role.entity';
import { ProfileRepository } from './profile.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Role], MONGODB_CONNEXION_NAME)
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileRepository],
})
export class ProfileModule {}
