import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { IRepository } from '@/common/interfaces/repository.interface';

@Injectable()
export class ProfileRepository
  extends Repository<Profile>
  implements IRepository<Profile>
{
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(Profile, dataSource.createEntityManager());
  }
  findAll(): Promise<readonly (Profile & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async store(entity: Omit<Profile, keyof AbstractEntity>) {
    return await this.save(entity);
  }

  async updateById(
    id: string,
    entity: Omit<Partial<Profile>, keyof AbstractEntity>,
  ) {
    await this.update({ id }, entity);
  }

  async findById(id: string) {
    return await this.findOne({
      where: {
        id,
      },
      relations: {
        roles: true,
      },
    });
  }

  async deleteById(id: string) {
    await this.delete(id);
  }
}
