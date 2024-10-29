import { AbstractEntity } from '../entities/abstract.entity'

export interface IService<TEntity extends AbstractEntity> {
  create(entity: Omit<TEntity, keyof AbstractEntity>): Promise<TEntity & AbstractEntity>

  getById(id: string): Promise<TEntity & AbstractEntity>

  getAll(): Promise<ReadonlyArray<TEntity & AbstractEntity>>

  updateById(id: string, entity: Omit<Partial<TEntity>, keyof AbstractEntity>): Promise<void>

  deleteById(id: string): Promise<void>

  restoreById?(id: string): Promise<void>
}