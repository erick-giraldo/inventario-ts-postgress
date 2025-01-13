import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EmailNotificationStatus } from './email-notification-status.enum';
import { User } from '../user/user.entity';

@Entity()
export class EmailNotification extends AbstractEntity {
  @Column()
  readonly subject: string

  @Column()
  readonly body: string

  @Column({
    type: 'enum',
    enum: EmailNotificationStatus,
    default: EmailNotificationStatus.PENDING
  })
  readonly status?: EmailNotificationStatus

  @ManyToOne(() => User, { nullable: false })
  readonly recipient: User
}