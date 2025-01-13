import { Module } from '@nestjs/common';
import { ConfirmationCodeService } from './confirmation-code.service';
import { ConfirmationCodeRepository } from './confirmation-code.repository';
import { ConfirmationCode } from './confirmation-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConfirmationCode])],
  providers: [ConfirmationCodeService, ConfirmationCodeRepository],
  exports: [ConfirmationCodeService],
})
export class ConfirmationCodeModule {}
