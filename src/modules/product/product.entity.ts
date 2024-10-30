import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn({ name: '_id' })
  readonly id?: ObjectId;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  @Column()
  readonly categoryId: string;

  @Column()
  readonly code: string;

  @Column()
  readonly brandId: string;

  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly stock: string;

  @Column()
  readonly price: string;

  @Column()
  readonly image: string;

  @Column()
  readonly status: boolean;
}
