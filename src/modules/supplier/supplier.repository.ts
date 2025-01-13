import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ObjectId } from 'mongodb';
import { Supplier } from './supplier.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Injectable()
export class SupplierRepository
  extends Repository<Supplier>
  implements IRepository<Supplier>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Supplier, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Supplier & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Supplier & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(id: string, entity: Omit<Partial<Supplier>, keyof AbstractEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Supplier, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Supplier>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    return { items, count };
  }

  async store(supplier: Supplier) {
    return await this.save(supplier);
  }

  async updateSupplier(id: string, updateData: Partial<Supplier>) {
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
