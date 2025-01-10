import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './profile.entity';
import { ProfileRepository } from './profile.repository';
import { RoleModule } from '../role/role.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    RoleModule,
    ConfigModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileRepository],
  exports: [ProfileRepository, ProfileService],
})
export class ProfileModule {}
