import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Message extends AbstractEntity {
  @Column()
  to: string;

  @Column({ type: 'json', nullable: true })
  readonly from: Record<string, unknown> | null = null;

  @Column()
  subject: string;

  @Column()
  html: string;
}
