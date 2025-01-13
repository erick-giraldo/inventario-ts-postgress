import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Entity, Column, OneToOne } from 'typeorm';
import { Product } from '../product/product.entity';
@Entity()
export class Brand extends AbstractEntity {
  @Column({ type: 'varchar' })
  readonly name: string;

  @Column({ type: 'varchar' })
  readonly description: string;

  @Column({ type: 'boolean', default: false })
  readonly status?: boolean;

  @OneToOne(() => Product, (it) => it.brand)
  readonly product?: Product;
}
