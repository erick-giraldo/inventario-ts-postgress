import {
  Entity,
  ObjectIdColumn,
  Column,
  ObjectId,
  CreateDateColumn,
  UpdateDateColumn,
  Index, // Importamos Index
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

  @Index({ unique: true }) // Añadimos el índice único aquí
  @Column()
  readonly code: string;

  @Column()
  readonly brandId: string;

  @Index({ unique: true }) 
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
