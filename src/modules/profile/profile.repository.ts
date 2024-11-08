import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, MongoRepository, ObjectId } from 'typeorm';
import { Profile } from './profile.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { AbstractEntity } from '@/common/entities/abstract.entity';

@Injectable()
export class ProfileRepository extends MongoRepository<Profile> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(Profile, dataSource.mongoManager);
  }

  async store(entity: Omit<Profile, keyof AbstractEntity>) {
    return await this.save(entity);
  }

  async findAll(): Promise<Profile[]> {
    return await this.find();
  }

  async updateById(id: string, entity: Partial<Omit<Profile, keyof AbstractEntity>>) {
    await this.update({ id: new ObjectId(id) }, entity); 
  }

  async deleteById(id: string): Promise<void> {
    await this.delete(new ObjectId(id));
  }

  async restoreById(id: string): Promise<void> {

  }

  async findById(id: string): Promise<Profile | null> {
    return await this.findOne({ where: { id: new ObjectId(id) } });
  }
}
