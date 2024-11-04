import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../../user/user.entity';
import { EntityWithId } from '@/common/types/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user: EntityWithId<User> | undefined = req.user;
    if (!user) throw new UnauthorizedException();

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles?.length) return false;

    const lowercasedRoles = roles.map((it: string) => it.toLowerCase());
    return (
      user.profiles?.some((profile) => {
        return profile.roles.some((role) => {
          return lowercasedRoles.includes(role.name.toLowerCase());
        });
      }) || false
    );
  }
}
