import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { User } from '../../user/user.entity';

@Injectable()
export class SessionGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or malformed');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decodedToken = await this.jwtService.verifyAsync(token);
      const user = plainToInstance(User, decodedToken);

      if (!user.isActive || !user.isEmailAddressVerified) {
        throw new UnauthorizedException('User is not active or email address is not verified');
      }

      req.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token',error.message);
    }
  }
}
