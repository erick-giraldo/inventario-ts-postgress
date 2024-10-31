import {
  CreateDateColumn,
  DeleteDateColumn,
  ObjectId,
  ObjectIdColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class AbstractEntity {
  @ObjectIdColumn({ name: '_id' })
  readonly id?: ObjectId;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;

  @DeleteDateColumn({ select: false })
  readonly deletedAt?: Date | null
}