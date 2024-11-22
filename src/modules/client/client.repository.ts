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

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof Client, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<Client>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
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
