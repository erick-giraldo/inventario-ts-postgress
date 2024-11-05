import { Entity, Column, ObjectIdColumn, ObjectId, Index } from 'typeorm';
import { User } from '../user/user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Entity()
export class Session extends AbstractEntity {
  @ObjectIdColumn()
  sessionId: string;

  @Column(type => User)
  user: User;

  @Column()
  @Index({ expireAfterSeconds: 86400 }) // Expira después de 24 horas
  expiresAt: Date;
}
