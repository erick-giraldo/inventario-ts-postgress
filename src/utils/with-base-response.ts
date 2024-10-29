import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { mixin } from '@nestjs/common';
import { Type } from 'class-transformer';

export function withBaseResponse<T extends abstract new (...args: any) => any>(
  type: T,
  options?: ApiPropertyOptions
) {
  class BaseResponse {
    @ApiProperty({ example: 'success' })
    message: string

    @ApiProperty({ type, ...options })
    @Type(() => type)
    data: InstanceType<T>
  }

  return mixin(BaseResponse);
}