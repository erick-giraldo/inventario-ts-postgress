import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ObjectId } from 'mongodb';
import { Category } from './category.entity';

@Injectable()
export class CategoryRepository extends MongoRepository<Category> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Category, dataSource.mongoManager);
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
     return await this.findOne({ where: { _id: new ObjectId(id) } });
  }
}
