import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Product } from './product.entity';
import { ObjectId } from 'mongodb';
import { CategoryRepository } from '../category/category.repository';
import { BrandRepository } from '../brand/brand.repository';
@Injectable()
export class ProductRepository extends MongoRepository<Product> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
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

    const newItems = await Promise.all(
      items.map(async (item) => {
        const prooductsDetails = {
          category: item.category
            ? await this.categoryRepository.findOne({
                where: { _id: new ObjectId(item.category) },
              })
            : null,
          brand: item.brand
            ? await this.brandRepository.findOne({
                where: { _id: new ObjectId(item.brand) },
              })
            : null,
        };

        return {
          ...item,
          category: prooductsDetails.category,
          brand: prooductsDetails.brand,
        };
      }),
    );

    return { items: newItems, count };
  }

  async store(product: Product) {
    return await this.save(product);
  }

  async updateProduct(id: string, updateData: Partial<Product>) {
    return this.update(id, updateData);
  }

  async activate(id: string, newStatus: boolean) {
    return this.update(id, {
      status: newStatus,
    });
  }

  async getById(id: string) {
    const found = await this.findOne({ where: { _id: new ObjectId(id) } });
    if(!found) return
    const newItems = {
      category: found?.category
        ? await this.categoryRepository.findOne({
            where: { _id: new ObjectId(found?.category) },
          })
        : null,
      brand: found?.brand
        ? await this.brandRepository.findOne({
            where: { _id: new ObjectId(found?.brand) },
          })
        : null,
    };
    return {
      ...found,
      category: newItems.category,
      brand: newItems.brand,
    };
  }
}
