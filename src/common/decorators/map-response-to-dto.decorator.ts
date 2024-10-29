import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiResponseOptions } from '@nestjs/swagger';
import { WrapToClassInterceptor } from '@/common/interceptors/wrap-to-class.interceptor';

export const MapResponseToDto = <T extends new (...args: any) => any>(
  type: T,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    UseInterceptors(WrapToClassInterceptor(type)),
    ApiOkResponse({ type, ...options }),
  )
}