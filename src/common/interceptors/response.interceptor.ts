import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';

export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(it => {
        if (typeof it === 'object' && it && 'message' in it)
          return it 

        if (typeof it === 'object' && it && 'data' in it && 'meta' in it && 'links' in it) {
          return {
            message: 'success',
            data: {
              results: it.data,
              meta: it.meta,
              links: it.links
            }
          } 
        }

        return {
          message: 'success',
          data: it
        }
      })
    )
  }
}
