import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Customer } from './customer.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Injectable()
export class CustomerRepository
  extends Repository<Customer>
  implements IRepository<Customer>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Customer, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Customer & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Customer & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(id: string, entity: Omit<Partial<Customer>, keyof AbstractEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async store(supplier: Customer) {
    return await this.save(supplier);
  }

  async updateClient(id: string, updateData: Partial<Customer>) {
    return this.update(id, updateData);
  }

  async activate(id: string, newStatus: boolean) {
    return this.update(id, {
      status: newStatus,
    });
  }

  async getById(id: string) {
    return await this.findOne({ where: { id } });
  }
}
