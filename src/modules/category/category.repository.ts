import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Category } from './category.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Injectable()
export class CategoryRepository
  extends Repository<Category>
  implements IRepository<Category>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Category, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Category & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Category & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(
    id: string,
    entity: Omit<Partial<Category>, keyof AbstractEntity>,
  ): Promise<void> {
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
    sort: Record<keyof Category, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Category>,
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

  async store(product: Category) {
    return await this.save(product);
  }

  async updateProduct(id: string, updateData: Partial<Category>) {
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
