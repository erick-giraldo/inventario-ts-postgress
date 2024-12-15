import { Module } from '@nestjs/common';
import { ConfirmationCodeService } from './confirmation-code.service';
import { ConfirmationCodeRepository } from './confirmation-code.repository';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { ConfirmationCode } from './confirmation-code.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  imports: [
    TypeOrmModule.forFeature([ConfirmationCode], MONGODB_CONNEXION_NAME),
  ],
  providers: [ConfirmationCodeService, ConfirmationCodeRepository],
  exports: [ConfirmationCodeService],
})
export class ConfirmationCodeModule {}
