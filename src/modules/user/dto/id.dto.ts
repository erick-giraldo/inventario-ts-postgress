import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IdDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  id: string
}