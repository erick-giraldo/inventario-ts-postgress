import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Brand } from './brand.entity';

@Injectable()
export class BrandRepository
  extends Repository<Brand>
  implements IRepository<Brand>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Brand, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Brand & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Brand & AbstractEntity)[]> {
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
    sort: Record<keyof Brand, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Brand>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    return { items, count };
  }

  async getAll() {
    return await this.find({
      where: {
        status: true,
      },
    });
  }

  async store(product: Brand) {
    return await this.save(product);
  }

  async updateById(
    id: string,
    entity: Omit<Partial<Brand>, keyof AbstractEntity>,
  ) {
    await this.update({ id }, entity);
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
