import {
  CallHandler,
  ExecutionContext,
  mixin,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { plainToInstance } from 'class-transformer';

export function WrapToClassInterceptor<T extends new (...args: any) => any>(
  type: T
) {
  class MixinInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler) {
      return next.handle().pipe(
        map((it) => {
          return typeof it === 'object' && it
            ? plainToInstance(type, {
                message: 'success',
                data: it
              })
            : it
        }),
      );
    }
  }

  return mixin(MixinInterceptor)
}