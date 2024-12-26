import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';
import { ObjectId } from 'mongodb';
import { BrandRepository } from './brand.repository';
import { Brand } from './brand.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository)
    private readonly brandRepository: BrandRepository,
  ) {}

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

    const paginated = await this.brandRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Brand, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Brand>,
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

  async getAll() {
    const find = await this.brandRepository.getAll();
    if (!find) {
      throw new NotFoundException({
        message: 'Brand does not exist',
      });
    }
    return find;
  }

  async save(data: Brand) {
    try {
      return await this.brandRepository.store({
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
          message: `Brand already exists, ${duplicateKey} is duplicated`,
        });
      }

      throw e;
    }
  }


  async update(id: string, data: Partial<Brand>) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    return this.brandRepository.updateProduct(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    const newStatus = !found.status;
    return this.brandRepository.activate(id, newStatus);
  }

  async findById(id: string) {
    return await this.brandRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
