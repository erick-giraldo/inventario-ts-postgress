import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, FindOptionsWhere, MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from './user.entity';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { ProfileRepository } from '../profile/profile.repository';

@Injectable()
export class UserRepository extends MongoRepository<User> {
  constructor(
    @InjectDataSource(MONGODB_CONNEXION_NAME) dataSource: DataSource,
    private readonly profileRepository: ProfileRepository,
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

  async updateById(
    id: string,
    entity: Partial<Omit<User, keyof AbstractEntity>>,
  ) {
    return await this.update({ id: new ObjectId(id) }, entity);
  }

  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string) {
    const user = await this.findOne({ where: { _id: new ObjectId(id) } });
    if (!user) return;
    const profiles = user.profiles
      ? await Promise.all(
          user.profiles.map((profileId) =>
            this.profileRepository.findById(profileId),
          ),
        )
      : [];

    return { ...user, profiles };
  }

  async findByUsernameOrEmailAddress(usernameOrEmail: string) {
    const found = usernameOrEmail?.trim();
    if (!found) return;
    const isEmail = found.includes('@');
    if (
      isEmail &&
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(found)
    )
      return null;

    const user = await this.findOne({
      where: isEmail ? { emailAddress: found } : { username: found },
    });

    if (!user) return null;

    const profiles = user.profiles
      ? await Promise.all(
          user.profiles.map((profileId) =>
            this.profileRepository.findById(profileId),
          ),
        )
      : [];

    return { ...user, profiles };
  }

  async findPaginated(
    page: number,
    limit: number,
    sort: Record<keyof User, 'ASC' | 'DESC'>,
    filter: FindOptionsWhere<User>,
  ) {
    const [users, count] = await this.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: sort,
      where: filter,
    });

    const usersWithProfiles = await Promise.all(
      users.map(async (user) => {
        const profileDetails = user.profiles
          ? await Promise.all(
              user.profiles.map((profileId) =>
                this.profileRepository.findById(profileId),
              ),
            )
          : [];

        return { ...user, profiles: profileDetails };
      }),
    );

    return { items: usersWithProfiles, count };
  }
}
