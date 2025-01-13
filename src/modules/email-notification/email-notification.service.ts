import { Injectable } from '@nestjs/common';
import { EmailNotificationRepository } from './email-notification.repository';
import { EmailNotification } from './email.notification.entity';
import { EmailNotificationStatus } from './email-notification-status.enum';
import { In } from 'typeorm';

@Injectable()
export class EmailNotificationService {
  constructor(private readonly emailNotificationRepository: EmailNotificationRepository) {}

  async create(data: Omit<EmailNotification, 'id'>) {
    return await this.emailNotificationRepository.store(data)
  }

  async getByStatuses(statuses: ReadonlyArray<EmailNotificationStatus>) {
    return this.emailNotificationRepository.findByStatuses(statuses)
  }

  async updateStatus(ids: ReadonlyArray<string>, status: EmailNotificationStatus) {
    return this.emailNotificationRepository.update({
      id: In(ids)
    }, {
      status
    })
  }
}