import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../../user/user.entity';
import { EntityWithId } from '@/common/types/types';


export const UserDecorator = createParamDecorator<
  keyof User | undefined,
  ExecutionContext,
  EntityWithId<User>
>((prop, context) => {
  const req = context.switchToHttp().getRequest()
  if (!req.user) throw new UnauthorizedException()

  return prop ? req.user[prop] : req.user
})
