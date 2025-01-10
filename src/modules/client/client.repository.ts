import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { Client } from './client.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Injectable()
export class ClientRepository
  extends Repository<Client>
  implements IRepository<Client>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Client & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Client & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(id: string, entity: Omit<Partial<Client>, keyof AbstractEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
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
