// product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductRepository } from './product.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) {}

  async create(data: Product) {
    return this.productRepository.store(data);
  }

  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort = query.sortBy?.reduce((acc, [key, value]) => {
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
    return this.productRepository.findById(id);
  }

  async update(id: string, data: Partial<Product>) {
    return this.productRepository.update(id, data);
  }

  async delete(id: string) {
    return this.productRepository.delete(id);
  }
}
