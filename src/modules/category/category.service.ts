import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery } from 'nestjs-paginate';
import { CategoryRepository } from './category.repository';
import { FindOptionsWhere } from 'typeorm';
import { Category } from './category.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
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

    const paginated = await this.categoryRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Category, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Category>,
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
    const find = await this.categoryRepository.getAll();
    if (!find) {
      throw new NotFoundException({
        message: 'Category does not exist',
      });
    }
    return find;
  }

  async save(data: Category) {
    try {
      return await this.categoryRepository.store({
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
          message: `Category already exists, ${duplicateKey} is duplicated`,
        });
      }

      throw e;
    }
  }

  async update(id: string, data: Partial<Category>) {
    const found = await this.findById(id);
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return this.categoryRepository.updateProduct(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id);
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    const newStatus = !found.status;
    return this.categoryRepository.activate(id, newStatus);
  }

  async findById(id: string) {
    return await this.categoryRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
