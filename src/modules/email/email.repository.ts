import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MongoRepository } from 'typeorm';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ObjectId } from 'mongodb';
import { Message } from './email.entity';

@Injectable()
export class EmailRepository extends MongoRepository<Message> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }
  async findAll() {
    return this.find();
  }

  async store(
    entity: Omit<Message, keyof AbstractEntity>,
  ): Promise<Message & AbstractEntity> {
    const respomse = this.create(entity);
    return this.save(respomse);
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(new ObjectId(id)); // Convierte id a ObjectId
  }

  async findById(id: ObjectId) {
    return await this.findOneBy({ _id: id });
  }
}
