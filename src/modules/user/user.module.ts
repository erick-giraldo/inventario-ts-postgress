import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '../session/session.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    SessionModule,
    ConfigModule,
  ],
  providers: [],
  exports: [],
  controllers: [],
})
export class UserModule {}
