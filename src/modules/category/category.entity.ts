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
  @ObjectIdColumn()
  readonly id?: ObjectId;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  @Column()
  readonly name: string;

  @Column()
  readonly description: string;

  @Column()
  readonly status: boolean;
}
