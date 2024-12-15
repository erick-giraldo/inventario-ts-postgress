import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailRepository } from './email.repository';

@Module({
  providers: [EmailService, EmailRepository],
  exports: [EmailService]
})
export class EmailModule {}
