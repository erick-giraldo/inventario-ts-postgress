import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { ObjectId } from 'mongodb';
import { categoryPaginateConfig } from './category-paginate-config';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return paginate(query, this.categoryRepository, categoryPaginateConfig);
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
      if (e.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException({
          message: 'Category already exists',
        });
      }
      throw e;
    }
  }

  async update(id: string, data: Partial<Category>) {
    await this.findById(id);
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
    const found = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return found;
  }
}
