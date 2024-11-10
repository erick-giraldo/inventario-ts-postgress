import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../category.entity';
import { ObjectId } from 'mongodb';

export class ReturnCategoryDto implements Category {
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