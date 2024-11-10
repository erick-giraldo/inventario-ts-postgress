import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'typeorm';
import { Category } from 'src/modules/category/category.entity';
import { Brand } from 'src/modules/brand/brand.entity';

export class ReturnProductDto {
  @ApiProperty()
  id?: ObjectId | undefined;

  @ApiProperty()
  createdAt?: Date | undefined;

  @ApiProperty()
  updatedAt?: Date | undefined;

  @ApiProperty({ format: 'uuid' })
  category: Category;

  @ApiProperty()
  code: string;

  @ApiProperty({ format: 'uuid' })
  brand: Brand;

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