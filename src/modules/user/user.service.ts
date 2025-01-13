import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { userPaginateConfig } from './user-paginate-config';
import { SessionService } from '../session/session.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sessionService: SessionService,
  ) {}

  async findPaginated(query: PaginateQuery) {
    return paginate(query, this.userRepository, userPaginateConfig);
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
    if (!found) throw new NotFoundException();

    return found;
  }

  // async createUser(
  //   createUserDto: CreateUserDto,
  //   user: EntityWithId<User>,
  // ): Promise<boolean> {
  //   try {
  //     if (!user.profiles) {
  //       throw new NotFoundException({
  //         message: 'User has no profile assigned',
  //       });
  //     }

  //     const foundProfiles = await Promise.all(
  //       user.profiles.map((profile) => {
  //         return this.profileRepository.findById(profile.id);
  //       }),
  //     );

  //     if (!foundProfiles.some((profile) => profile.shortName === 'owner')) {
  //       throw new NotFoundException({
  //         message: 'User has no owner profile assigned',
  //       });
  //     }

  //     const defaultProfile = await this.profileRepository.findOne({
  //       where: {
  //         type: ProfileType.USER,
  //         shortName: 'viewer',
  //       },
  //     });
  //     const profileData = await this.profileRepository.findOne({
  //       where: {
  //         type: ProfileType.USER,
  //         shortName: createUserDto.shortProfile,
  //       },
  //     });

  //     const profiles = profileData ? profileData : defaultProfile;

  //     if (!profiles) {
  //       throw new NotFoundException({
  //         message: 'Profile not found',
  //       });
  //     }

  //     const hashedPassword = await bcrypt.hash('', await bcrypt.genSalt());

  //     const createUser = {
  //       ...createUserDto,
  //       password: hashedPassword,
  //       profiles: [profiles.id!],
  //       isActive: false,
  //       isEmailAddressVerified: false,
  //       isTwoFaEnabled: false,
  //       userType: UserType.USER
  //     };
  //     await this.userRepository.save(createUser);
  //     return true;
  //   } catch (e) {
  //     if (e.code === 11000) {
  //       const duplicateKeyMatch = e.message.match(/\{ (.+?) \}/);
  //       const duplicateKey = duplicateKeyMatch
  //         ? duplicateKeyMatch[1].replace(/["]/g, '')
  //         : 'unknown';
  //       throw new ConflictException({
  //         message: `User already exists, ${duplicateKey} is duplicated`,
  //       });
  //     }
  //     throw e;
  //   }
  // }

  async createUser(user: Omit<User, 'toJSON'>) {
    return await this.userRepository.store(user);
  }

  async updateById(
    id: string,
    entity: Partial<Omit<User, keyof AbstractEntity | 'toJSON'>>,
    sessionId?: string,
  ) {
    const result = await this.userRepository.updateById(id, entity);
    if (sessionId) await this.sessionService.updateSession(sessionId, entity);

    return result;
  }
}
