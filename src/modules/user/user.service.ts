import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityWithId } from '@/common/types/types';
import { ObjectId } from 'mongodb';
import { ProfileRepository } from '../profile/profile.repository';
import { ProfileType } from 'src/utils/enums';
import * as bcrypt from 'bcrypt';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { UserType } from './user-type.enum';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

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

  async createUser(
    createUserDto: CreateUserDto,
    user: EntityWithId<User>,
  ): Promise<boolean> {
    try {
      if (!user.profiles) {
        throw new NotFoundException({
          message: 'User has no profile assigned',
        });
      }

      const foundProfiles = await Promise.all(
        user.profiles.map((profile) => {
          const profileId = new ObjectId(profile);
          return this.profileRepository.findById(profileId);
        }),
      );

      if (!foundProfiles.some((profile) => profile.shortName === 'owner')) {
        throw new NotFoundException({
          message: 'User has no owner profile assigned',
        });
      }

      const defaultProfile = await this.profileRepository.findOne({
        where: {
          type: ProfileType.USER,
          shortName: 'viewer',
        },
      });
      const profileData = await this.profileRepository.findOne({
        where: {
          type: ProfileType.USER,
          shortName: createUserDto.shortProfile,
        },
      });

      const profiles = profileData ? profileData : defaultProfile;

      if (!profiles) {
        throw new NotFoundException({
          message: 'Profile not found',
        });
      }

      const hashedPassword = await bcrypt.hash('', await bcrypt.genSalt());

      const createUser = {
        ...createUserDto,
        password: hashedPassword,
        profiles: [profiles.id!],
        isActive: false,
        isEmailAddressVerified: false,
        isTwoFaEnabled: false,
        userType: UserType.USER
      };
      await this.userRepository.save(createUser);
      return true;
    } catch (e) {
      if (e.code === 11000) {
        const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
        const duplicateKey = duplicateKeyMatch
          ? duplicateKeyMatch[1].replace(/["]/g, '')
          : 'unknown';
        throw new ConflictException({
          message: 'User already exists',
          duplicateKey,
        });
      }
      throw e;
    }
  }

  async updateById(
    id: string,
    user: Partial<Omit<User, keyof AbstractEntity | 'toJSON'>>,
  ) {
    return await this.userRepository.updateById(id, user);
  }
}
