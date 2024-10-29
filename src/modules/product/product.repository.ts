// product.repository.ts
import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Product } from './product.entity';

@Injectable()
export class ProductRepository extends MongoRepository<Product> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Product, dataSource.mongoManager);
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Product, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Product>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    return { items, count };
  }

  async store(product: Product) {
    return await this.save(product);
  }

  async findById(id: string) {
    return await this.findOneBy({ id });
  }
}
