import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Entity, Column, Index } from 'typeorm';
@Entity()
export class Category extends AbstractEntity {
  @Index({ unique: true })
  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly status?: boolean;
}
