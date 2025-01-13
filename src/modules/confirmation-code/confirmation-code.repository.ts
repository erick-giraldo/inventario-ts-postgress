import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { ConfirmationCode } from './confirmation-code.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfirmationCodeRepository extends Repository<ConfirmationCode> implements IRepository<ConfirmationCode> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(ConfirmationCode, dataSource.createEntityManager());
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  findAll(): Promise<ReadonlyArray<ConfirmationCode & Required<AbstractEntity>>> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<(ConfirmationCode & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }

  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  store(entity: Omit<ConfirmationCode, keyof AbstractEntity>) {
    return this.save(entity)
  }

  updateById(id: string, entity: Omit<Partial<ConfirmationCode>, keyof AbstractEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
}