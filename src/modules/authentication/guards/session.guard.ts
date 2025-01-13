import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../../session/session.service';
import { plainToInstance } from 'class-transformer';
import { User } from '../../user/user.entity';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const sessionId = req.headers['x-session-id'];
    if (!sessionId) throw new UnauthorizedException();

    const session = await this.sessionService.getSession(sessionId)
    if (!session) throw new UnauthorizedException();

    const user = plainToInstance(User, JSON.parse(session));
    if (!user.isActive || !user.isEmailAddressVerified) {
      throw new UnauthorizedException('Unauthorized', {
        cause: 'User is not active or email address is not verified'
      })
    }

    req.user = user;

    return true
  }
}