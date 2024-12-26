import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplierRepository } from './supplier.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';
import { Supplier } from './supplier.entity';
import { ObjectId } from 'mongodb';
import { CreateSupplierDto } from './dto/create-supplier.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(SupplierRepository)
    private readonly supplierRepository: SupplierRepository,
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

    const paginated = await this.supplierRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Supplier, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Supplier>,
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

  async save(data: CreateSupplierDto) {
    try {
      return await this.supplierRepository.store({
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
          message: `Supplier already exists, ${duplicateKey} is duplicated`,
        });
      }

      throw e;
    }
  }

  
  async update(id: string, data: Partial<Supplier>) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    return this.supplierRepository.updateSupplier(id, data);
  }

  async activate(id: string) {
    const found = await this.findById(id)
    if (!found) {
      throw new ConflictException({ message: 'Category does not exist' });
    }
    const newStatus = !found.status;
    return this.supplierRepository.activate(id, newStatus);
  }

  async findById(id: string) {
    return await this.supplierRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
  }
}
