import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { BrandRepository } from './brand.repository';
import { Brand } from './brand.entity';
import { PG_UNIQUE_VIOLATION } from '@drdgvhbh/postgres-error-codes';
import { brandPaginateConfig } from './brand-paginate-config';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(BrandRepository)
    private readonly brandRepository: BrandRepository,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return paginate(query, this.brandRepository, brandPaginateConfig);
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
      if (e.code === PG_UNIQUE_VIOLATION) {
        throw new ConflictException({
          message: 'Brand already exists',
        });
      }
      throw e;
    }
  }

  async updateById(id: string, data: Partial<Brand>) {
    const found = await this.findById(id);
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    return this.brandRepository.update(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id);
    if (!found) {
      throw new ConflictException({ message: 'Product does not exist' });
    }
    const newStatus = !found.status;
    return this.brandRepository.activate(id, newStatus);
  }

  async findById(id: string) {
    const found = await this.brandRepository.findOne({
      where: { id },
    });
    if (!found) {
      throw new ConflictException({ message: 'Brand does not exist' });
    }
    return found;
  }
}
