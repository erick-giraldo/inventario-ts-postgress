import { Module } from '@nestjs/common';
import { ConfirmationCodeService } from './confirmation-code.service';
import { ConfirmationCodeRepository } from './confirmation-code.repository';
import { ConfirmationCode } from './confirmation-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ConfirmationCode]),
    ConfigModule
  ],
  providers: [ConfirmationCodeService, ConfirmationCodeRepository],
  exports: [ConfirmationCodeService],
})
export class ConfirmationCodeModule {}
