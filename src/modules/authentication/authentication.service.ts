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

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async signUpUser(userDto: CreateUserDto) {
    try {
      const defaultProfile = await this.profileRepository.findOne({
        where: {
          type: ProfileType.USER,
          shortName: 'owner',
        },
        relations: ['roles'],
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
    const payload = { sub: user.id, username: user.username };
    return {
      sessionId: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
