import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';

@Injectable()
export class UserRepository extends MongoRepository<User> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
  ) {
    super(User, dataSource.mongoManager);
  }

  async store(entity: Omit<User, keyof AbstractEntity>) {
    const result = await this.save(entity);
    return {
      _id: result.id,
      username: result.username,
      emailAddress: result.emailAddress,
    };
  }

  findAll(): Promise<readonly (User & Required<AbstractEntity>)[]> {
    throw new Error('Method not implemented.');
  }

  async updateById(
    id: string,
    entity: Partial<Omit<User, keyof AbstractEntity>>,
  ) {
    await this.update({ id: new ObjectId(id) }, entity); // Convierte id a ObjectId
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string) {
    console.log('🚀 ~ UserRepository ~ findById ~ id:', id);
    return await this.findOne({ where: { _id: new ObjectId(id) } });
  }

  async findByUsernameOrEmailAddress(usernameOrEmail: string) {
    const search = usernameOrEmail?.trim();
    if (!search) return null;

    const isEmail = search.includes('@');
    if (
      isEmail &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(search)
    )
      return null;

    return this.findOne({
      where: isEmail ? { emailAddress: search } : { username: search },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof User, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<User>,
  ) {
    const [items, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    return { items, count };
  }
}
