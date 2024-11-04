import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, MongoRepository, ObjectId, Repository } from 'typeorm';
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
    return await this.save(entity);
  }

  findAll(): Promise<readonly (User & Required<AbstractEntity>)[]> {
    throw new Error('Method not implemented.');
  }

  async updateById(id: string, entity: Partial<Omit<User, keyof AbstractEntity>>) {
    await this.update({ id: new ObjectId(id) }, entity); // Convierte id a ObjectId
  }


  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string) {
    // const relations = ['profile'];
    return this.findOne({
      where: {
        id,
      },
      // relations,
    });
  }

  async findByUserAndClient(userId: string, clientId: string) {
    return await this.findOne({
      where: {
        id: userId,
        client: {
          id: clientId,
        },
      },
      relations: ['client'],
    });
  }

  async findByUsernameOrEmailAddress(usernameOrEmailAddress: string) {
    console.log("🚀 ~ UserRepository ~ findByUsernameOrEmailAddress ~ usernameOrEmailAddress:", usernameOrEmailAddress);
    try {
        const user = await this.findOne({
            where: [
              { emailAddress: usernameOrEmailAddress.toLowerCase() },
            ],
        });
        console.log("User found:", user);
        return user;
    } catch (error) {
        console.error("Error finding user:", error);
        throw error;
    }
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