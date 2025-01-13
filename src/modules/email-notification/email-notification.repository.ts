import { Injectable } from '@nestjs/common';
import { DataSource, In, Repository } from 'typeorm';
import { EmailNotification } from './email.notification.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { EmailNotificationStatus } from './email-notification-status.enum';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class EmailNotificationRepository extends Repository<EmailNotification> implements IRepository<EmailNotification> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(EmailNotification, dataSource.createEntityManager());
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<ReadonlyArray<EmailNotification & AbstractEntity>> {
    throw new Error('Method not implemented.');
  }

  findById(id: string) {
    return this.findOne({
      where: {
        id
      }
    })
  }

  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async store(entity: Omit<EmailNotification, keyof AbstractEntity>) {
    return await this.save(entity);
  }

  async updateById(
    id: string,
    entity: Omit<Partial<EmailNotification>, keyof AbstractEntity>,
  ) {
    throw new Error('Method not implemented.');
  }

  async findByStatuses(statuses: ReadonlyArray<EmailNotificationStatus>) {
    return this.find({
      where: {
        status: In(statuses)
      },
      relations: {
        recipient: true
      }
    })
  }
}