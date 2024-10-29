import { AbstractEntity } from '../entities/abstract.entity'

export interface IRepository<TEntity extends AbstractEntity> {
  store(entity: Omit<TEntity, keyof AbstractEntity>): Promise<TEntity & AbstractEntity>

  findById(id: string): Promise<(TEntity & AbstractEntity) | null>

  findAll(): Promise<ReadonlyArray<TEntity & AbstractEntity>>

  updateById(id: string, entity: Omit<Partial<TEntity>, keyof AbstractEntity>): Promise<void>

  deleteById(id: string): Promise<void>

  restoreById(id: string): Promise<void>
}