import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateBrandDto extends AbstractEntity{
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  description?: string;
}