import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailRepository } from './email.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailService, EmailRepository],
  exports: [EmailService]
})
export class EmailModule {}
