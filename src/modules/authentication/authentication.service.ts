import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUpUser(userDto: CreateUserDto) {
    try {
      const user = await this.userService.create({
        ...userDto,
        password: await bcrypt.hash(userDto.password, await bcrypt.genSalt()),
        isActive: false,
      });

      return user;
    } catch (e) {
      if (e.code === 11000) {
        throw new ConflictException({
          message: 'User or client already exists',
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
      throw new UnauthorizedException('Unauthorized', {
        cause: 'Invalid password',
      });
    }
    const payload = { sub: user.id, username: user.username };
    return {
      sessionId: await this.jwtService.signAsync(payload),
      user,
    };
  }
}
