import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort =
      query.sortBy?.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}) || {};

    const paginated = await this.userRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof User, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<User>,
    );

    return {
      results: paginated.items,
      meta: {
        itemsPerPage: limit,
        totalItems: paginated.count,
        currentPage: page,
        totalPages: Math.ceil(paginated.count / limit),
      },
    };
  }

  async create(user: Omit<User, 'toJSON'>) {
    return await this.userRepository.store(user);
  }

  async findById(id: string) {
    const found = await this.userRepository.findById(id);
    if (!found) {
      throw new NotFoundException({
        message: 'User not Found',
      });
    }
    return found;
  }

  async getByUsernameOrEmailAddress(emailAddress: string) {
    const found =
      await this.userRepository.findByUsernameOrEmailAddress(emailAddress);
    if (!found) {
      throw new NotFoundException({
        message: 'User not Found',
      });
    }
    return found;
  }
}
