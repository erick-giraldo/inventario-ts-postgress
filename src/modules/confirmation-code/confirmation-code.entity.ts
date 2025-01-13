import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { ConfirmationCodeType } from './confirmation-code-type.enum';

@Entity()
export class ConfirmationCode extends AbstractEntity {
  @Column({ unique: true })
  readonly code: string;

  @Column()
  readonly expiresAt?: Date;

  @Column({ default: false })
  readonly isUsed?: boolean;

  @Column({ type: 'enum', enum: ConfirmationCodeType })
  readonly type: ConfirmationCodeType

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  readonly user?: User;
}