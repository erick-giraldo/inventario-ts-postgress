import { AbstractEntity } from '@/common/entities/abstract.entity';

export type EntityWithId<TEntity extends AbstractEntity> = TEntity & {
  id: string;
};

