import { AbstractEntity } from '@/common/entities/abstract.entity';
import { NaturalDocumentType } from '@/common/enums/document-type.enum';
import { Entity, Column, Index } from 'typeorm';
@Entity()
export class Client extends AbstractEntity {
  @Column()
  readonly names: string;

  @Column()
  readonly surnames: string;

  @Column()
  @Index({ unique: true })
  readonly email: string;

  @Column()
  @Index({ unique: true })
  readonly mobileNumber: string;

  @Column({
    type: 'enum',
    enum: NaturalDocumentType
  })
  readonly documentType: NaturalDocumentType;

  @Column()
  @Index({ unique: true })
  readonly documentNumber: string;

  @Column({ default: true })
  readonly status: boolean;
}
