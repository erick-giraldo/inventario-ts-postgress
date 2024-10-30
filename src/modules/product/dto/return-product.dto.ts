import { ApiProperty } from '@nestjs/swagger';

import { ObjectId } from 'typeorm';
import { Transform } from 'class-transformer';
import { Product } from '../product.entity';

export class ReturnProductDto implements Product {
  @ApiProperty({
    type: 'string',
    format: 'uuid'
  })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  id?: ObjectId;

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