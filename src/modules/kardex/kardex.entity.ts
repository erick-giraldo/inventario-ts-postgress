import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Entity, Column, Index } from 'typeorm';

@Entity()
export class Kardex extends AbstractEntity {
  @Column()
  readonly category: string;

  @Index({ unique: true })
  @Column()
  readonly code: string;

  @Column()
  readonly brand: string;

  @Index({ unique: true })
  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly stock: number;

  @Column()
  readonly price: number;

  @Column()
  readonly image: string;

  @Column()
  readonly status?: boolean;
}
