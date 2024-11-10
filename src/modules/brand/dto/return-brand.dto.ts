import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Brand } from '../brand.entity';

export class ReturnBrandDto implements Brand {
  @ApiProperty()
  id?: ObjectId | undefined;

  @ApiProperty()
  createdAt?: Date | undefined;

  @ApiProperty()
  updatedAt?: Date | undefined;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;
}