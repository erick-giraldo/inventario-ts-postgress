import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ObjectId } from 'mongodb';
import { Movement } from './movement.entity';
import { ProductRepository } from '../product/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { BrandRepository } from '../brand/brand.repository';
import { DateFilter } from '../kardex/interface/kardex-reports.interface';
import { MovementType } from '@/common/enums/movement-type.enum';
import { SupplierRepository } from '../supplier/supplier.repository';
import { ClientRepository } from '../client/client.repository';
@Injectable()
export class MovementRepository extends MongoRepository<Movement> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly clientRepository: ClientRepository,
  ) {
    super(Movement, dataSource.mongoManager);
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Movement, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Movement>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    const newItems = await Promise.all(
      items.map(async (item) => {
        const productDetails = item.product
          ? await this.productRepository.findOne({
              where: { _id: new ObjectId(item.product) },
            })
          : null;

        const categoryDetails = productDetails?.category
          ? await this.categoryRepository.findOne({
              where: { _id: new ObjectId(productDetails.category) },
            })
          : null;

        const brandDetails = productDetails?.brand
          ? await this.brandRepository.findOne({
              where: { _id: new ObjectId(productDetails?.brand) },
            })
          : null;
        const supplierOrClient =
          item.type === MovementType.IN
            ? await this.supplierRepository.findOne({
                where: { _id: new ObjectId(item.supplierOrClient) },
              })
            : item.type === MovementType.OUT
              ? await this.clientRepository.findOne({
                  where: { _id: new ObjectId(item.supplierOrClient) },
                })
              : null;  
        return {
          ...item,
          product: {
            ...productDetails,
            category: categoryDetails,
            brand: brandDetails,
          },
          supplierOrClient
        };
      }),
    );

    return { items: newItems, count };
  }

  async findAll(dateFilter: DateFilter){
    const items = await this.find({
      where: dateFilter,
      order: { date: 'ASC' },
    });
    
    // Si no hay items, retornar array vacío en lugar de undefined
    if (!items) return [];
  
    // Retornar directamente el array transformado
    return Promise.all(
      items.map(async (item) => {
        const supplierOrClient =
          item.type === MovementType.IN
            ? await this.supplierRepository.findOne({
                where: { _id: new ObjectId(item.supplierOrClient) },
              })
            : item.type === MovementType.OUT
              ? await this.clientRepository.findOne({
                  where: { _id: new ObjectId(item.supplierOrClient) },
                })
              : null;
  
        return {
          ...item,
          supplierOrClient,
        };
      }),
    );
  }

  async store(movement: Movement) {
    return await this.save(movement);
  }

  async getById(id: string) {
    const item = await this.findOne({ where: { _id: new ObjectId(id) } });
    if (!item) return;

    const productDetails = item.product
      ? await this.productRepository.findOne({
          where: { _id: new ObjectId(item.product) },
        })
      : null;
    const newItems = {
      category: productDetails?.category
        ? await this.categoryRepository.findOne({
            where: { _id: new ObjectId(productDetails?.category) },
          })
        : null,
      brand: productDetails?.brand
        ? await this.brandRepository.findOne({
            where: { _id: new ObjectId(productDetails?.brand) },
          })
        : null,
    };
    return {
      ...item,
      product: {
        ...productDetails,
        category: newItems.category,
        brand: newItems.brand,
      },
    };
  }
}
