import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { CategoryService } from '../category/category.service';
import { BrandService } from '../brand/brand.service';
import { validateObjectId } from '@/common/utils/validate';
import { Category } from '../category/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  private checkCategoryStatus(category: Category): void {
    if (!category.status) {
      throw new ConflictException({ message: 'Category is not active' });
    }
  }


  async save(data: Omit<Product, keyof AbstractEntity>) {
    try {
      validateObjectId(data.categoryId);
      const category = await this.getById(data.categoryId);
      this.checkCategoryStatus(category);
      //   const brand = await this.brandService.findById()
      //   if (brand) {
      //     throw new ConflictException({
      //       message: 'Brand not exists',
      //     });
      //   }
      return await this.productRepository.store({
        ...data,
        status: false,
      });
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
    const category = await this.categoryService.findById(id);
    if (!category) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return category;
  }

  async update(id: string, data: Partial<Product>) {
    return this.productRepository.update(id, data);
  }

  async delete(id: string) {
    return this.productRepository.delete(id);
  }
}
