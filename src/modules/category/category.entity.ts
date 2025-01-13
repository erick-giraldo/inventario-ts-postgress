import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Entity, Column, Index, OneToOne } from 'typeorm';
import { Product } from '../product/product.entity';
@Entity()
export class Category extends AbstractEntity {
  @Index({ unique: true })
  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly status?: boolean;

  @OneToOne(() => Product, (it) => it.category)
  readonly product?: Product;
}
