import { DataSource, MongoRepository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { Product } from './product.entity';
import { ObjectId } from 'mongodb';
import { CategoryRepository } from '../category/category.repository';
import { BrandRepository } from '../brand/brand.repository';
import { NotModifiedException } from 'src/utils/exections';
@Injectable()
export class ProductRepository extends MongoRepository<Product> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {
    super(Product, dataSource.mongoManager);
  }

  private isBoolean(value: string): boolean {
    return value.toLowerCase() === '$eq:true';
  }

  private processFilters(
    filter: Record<string, unknown>,
  ): FindOptionsWhere<Product> {
    if (!filter) return {};

    const processedFilters: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filter)) {
      if (value === '$eq:true' || value === '$eq:false') {
        processedFilters[key] = this.isBoolean(value);
      } else if (typeof value === 'string' && value.startsWith('$eq:')) {
        processedFilters[key] = value.slice(4);
      } else if (typeof value === 'string' && value.startsWith('$ilike:')) {
        const ilikeValue = value.slice(7);
        processedFilters[key] = { $regex: new RegExp(ilikeValue, 'i') };
      } else {
        processedFilters[key] = value;
      }
    }

    return processedFilters;
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Product, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Product>,
  ) {
    const filters = this.processFilters(filter);
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: {
        ...filters,
      },
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
    const result = await this.update(id, updateData);
    console.log('🚀 ~ ProductRepository ~ updateProduct ~ result:', result);
    if (result.affected === 0) {
      throw new ConflictException({
        message: 'No changes were made to the product.',
      });
    }
    if (result.affected !== 0 && result.raw.modifiedCount !== 0) {
      return 'success';
    }
  }

  async activate(id: string, newStatus: boolean) {
    return this.update(id, {
      status: newStatus,
    });
  }

  async getById(id: string) {
    const found = await this.findOne({ where: { _id: new ObjectId(id) } });
    if (!found) return;
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
