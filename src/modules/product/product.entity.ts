import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Entity, Column, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';

@Entity()
export class Product extends AbstractEntity {
  @Index({ unique: true })
  @Column()
  readonly sku: string;

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
  readonly status: boolean;

  @ManyToOne(() => Category, (category) => category.product, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  readonly category?: Category | null;

  @ManyToOne(() => Brand, (brand) => brand.product, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  readonly brand?: Category | null;
}
