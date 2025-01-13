import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { IRepository } from '@/common/interfaces/repository.interface';

@Injectable()
export class UserRepository
  extends Repository<User>
  implements IRepository<User>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  findAll(): Promise<readonly (User & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async store(entity: Omit<User, keyof AbstractEntity>) {
    return await this.save(entity);
  }

  async updateById(
    id: string,
    entity: Omit<Partial<User>, keyof AbstractEntity>,
  ) {
    await this.update({ id }, entity);
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string) {
    return this.findOne({
      where: {
        id,
      },
      relations: {
        profiles: {
          roles: true,
        },
      },
    });
  }

  async findByUsernameOrEmailAddress(usernameOrEmailAddress: string) {
    return this.findOne({
      where: [
        {
          username: usernameOrEmailAddress,
        },
        {
          emailAddress: usernameOrEmailAddress,
        },
      ],
      relations: {
        profiles: {
          roles: true,
        },
      },
    });
  }
}
