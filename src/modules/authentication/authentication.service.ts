import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';
import { ProfileType } from 'src/utils/enums';
import { ProfileRepository } from '../profile/profile.repository';
import { EnvironmentVariables } from '@/common/config/environment-variables';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  async signUpUser(userDto: CreateUserDto) {
    if (!this.configService.get('USER_REGISTER')) {
      throw new NotFoundException(
        {
          message: 'Module is disabled',
        },
        {
          cause: 'Module is disabled',
        },
      );
    }

    try {
      const defaultProfile = await this.profileRepository.findOne({
        where: {
          type: ProfileType.USER,
          shortName: 'owner',
        },
      });

      if (!defaultProfile) {
        throw new NotFoundException({
          message: 'You cannot sign up at the moment',
        });
      }

      const user = await this.userService.create({
        ...userDto,
        profiles: [defaultProfile.id!],
        password: await bcrypt.hash(userDto.password, await bcrypt.genSalt()),
        isActive: false,
        isEmailAddressVerified:false
      });

      return user;
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

  async signIn(sigInDto: SignInDto) {
    const user = await this.userService.getByUsernameOrEmailAddress(
      sigInDto.emailAddress!,
    );
    const isPasswordValid = await bcrypt.compare(
      sigInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = {
      sub: user.id,
      username: user.username,
      isActive: user.isActive,
      isEmailAddressVerified: user.isEmailAddressVerified,
      profiles: user.profiles
    };
    return {
      sessionId: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
