import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { CategoryService } from '../category/category.service';
import { BrandService } from '../brand/brand.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  async save(data: Omit<Product, keyof AbstractEntity>) {
    try {
    //   const category = await this.categoryService.findById()
    //   if (!category) {
    //     throw new ConflictException({
    //       message: 'category not exists',
    //     });
    //   }
    //   const brand = await this.brandService.findById()
    //   if (brand) {
    //     throw new ConflictException({
    //       message: 'Brand not exists',
    //     });
    //   }
      return await this.productRepository.store(data);
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: 'Product already exists',
          duplicateKey,
        });
      }

      throw e;
    }
  }

  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort =
      query.sortBy?.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}) || {};

    const paginated = await this.productRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Product, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Product>,
    );

    return {
      results: paginated.items,
      meta: {
        itemsPerPage: limit,
        totalItems: paginated.count,
        currentPage: page,
        totalPages: Math.ceil(paginated.count / limit),
      },
    };
  }

  async getById(id: string) {
    console.log("🚀 ~ ProductService ~ getById ~ id:", id)
    return this.productRepository.getById(id);
  }

  async update(id: string, data: Partial<Product>) {
    return this.productRepository.update(id, data);
  }

  async delete(id: string) {
    return this.productRepository.delete(id);
  }
}
