import { DataSource, MongoRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from '../../utils/constants';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ObjectId } from 'mongodb';
import { Client } from './client.entity';

@Injectable()
export class ClientRepository extends MongoRepository<Client> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Client, dataSource.mongoManager);
  }

  private isBoolean(value: string): boolean {
    return value.toLowerCase() === '$eq:true';
  }

  private processFilters(
    filter: Record<string, unknown>,
  ): FindOptionsWhere<Client> {
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
      }
      else {
        processedFilters[key] = value;
      }
    }

    return processedFilters;
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Client, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Client>,
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

    return { items, count };
  }

  async store(supplier: Client) {
    return await this.save(supplier);
  }

  async updateClient(id: string, updateData: Partial<Client>) {
    return this.update(id, updateData);
  }

  async activate(id: string, newStatus: boolean) {
    return this.update(id, {
      status: newStatus,
    });
  }

  async getById(id: string) {
    return await this.findOne({ where: { _id: new ObjectId(id) } });
  }
}
