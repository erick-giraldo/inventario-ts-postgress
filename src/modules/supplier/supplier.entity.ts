import { AbstractEntity } from '@/common/entities/abstract.entity';
import { DocumentType } from '@/common/enums/document-type.enum';
import { Entity, Column, Index } from 'typeorm';
@Entity()
export class Supplier extends AbstractEntity {
  @Index({ unique: true })
  @Column()
  readonly companyName: string;

  @Column()
  readonly contact: string;

  @Column()
  @Index({ unique: true })
  readonly email: string;

  @Column()
  @Index({ unique: true })
  readonly mobileNumber: string;

  @Column({
    type: 'enum',
    enum: DocumentType
  })
  readonly documentType: DocumentType;

  @Column()
  @Index({ unique: true })
  readonly documentNumber: string;

  @Column({ default: true })
  readonly status: boolean;
}
