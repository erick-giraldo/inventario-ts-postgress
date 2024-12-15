import { DataSource, MongoRepository, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfirmationCode } from './confirmation-code.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Injectable } from '@nestjs/common';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';

@Injectable()
export class ConfirmationCodeRepository extends MongoRepository<ConfirmationCode> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource
  ) {
    super(ConfirmationCode, dataSource.mongoManager);
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<
    ReadonlyArray<ConfirmationCode & Required<AbstractEntity>>
  > {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<(ConfirmationCode & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }

  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  store(entity: Omit<ConfirmationCode, keyof AbstractEntity>) {
    return this.save(entity);
  }

  updateById(
    id: string,
    entity: Omit<Partial<ConfirmationCode>, keyof AbstractEntity>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
