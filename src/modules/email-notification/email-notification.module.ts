import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailNotification } from './email.notification.entity';
import { EmailNotificationRepository } from './email-notification.repository';
import { EmailNotificationService } from './email-notification.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmailNotification])],
  providers: [EmailNotificationRepository, EmailNotificationService],
  exports: [EmailNotificationService]
})
export class EmailNotificationModule {}