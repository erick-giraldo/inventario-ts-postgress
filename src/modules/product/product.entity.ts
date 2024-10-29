import { Entity, ObjectIdColumn, Column, ObjectId } from 'typeorm';

@Entity()
export class Product {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  precio: number;

  @Column()
  cantidad: number;
}
