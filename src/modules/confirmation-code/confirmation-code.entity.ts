import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Column, Entity, JoinColumn } from 'typeorm';
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

  @JoinColumn()
  readonly user?: string;
}