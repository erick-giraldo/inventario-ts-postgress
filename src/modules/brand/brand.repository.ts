import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ObjectId } from 'mongodb';
import { Brand } from './brand.entity';

@Injectable()
export class BrandRepository extends MongoRepository<Brand> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Brand, dataSource.mongoManager);
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

  async store(product: Brand) {
    return await this.save(product);
  }

  async updateProduct(id: string, updateData: Partial<Brand>) {
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
