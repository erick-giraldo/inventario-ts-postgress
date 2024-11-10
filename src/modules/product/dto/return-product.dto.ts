import { ApiProperty } from '@nestjs/swagger';

import { ObjectId } from 'typeorm';
import { Product } from '../product.entity';

export class ReturnProductDto implements Product {
  @ApiProperty()
  id?: ObjectId | undefined;

  @ApiProperty()
  createdAt?: Date | undefined;

  @ApiProperty()
  updatedAt?: Date | undefined;

  @ApiProperty({ format: 'uuid' })
  categoryId: string;

  @ApiProperty()
  code: string;

  @ApiProperty({ format: 'uuid' })
  brandId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  status: boolean;
}