import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../../modules/category/category.entity';
import { Brand } from '../../../modules/brand/brand.entity';
import { ObjectId } from 'mongodb';

export class ReturnProductDto {
  @ApiProperty({
    example: '6722424d0e0a0153d562b9c5',
    description: 'Unique identifier of the product',
  })
  id?: ObjectId | undefined;

  @ApiProperty({
    example: '2024-10-30T14:27:25.842Z',
    description: 'Timestamp when the product was created',
  })
  createdAt?: Date | undefined;

  @ApiProperty({
    example: '2024-10-30T14:27:25.842Z',
    description: 'Timestamp when the product was last updated',
  })
  updatedAt?: Date | undefined;

  @ApiProperty({
    example: {
      id: '673ce7270348db0441ee4c0f',
      createdAt: '2024-11-19T19:29:43.795Z',
      updatedAt: '2024-11-19T19:29:43.795Z',
      name: 'Router',
      description: 'Router inalambricos',
      status: true,
    },
    description: 'Category of the product',
  })
  category: Category;

  @ApiProperty({
    example: '12312312312',
    description: 'Unique product code',
  })
  code: string;

  @ApiProperty({
    example: {
      id: '673ce7820348db0441ee4c11',
      createdAt: '2024-11-19T19:31:14.143Z',
      updatedAt: '2024-11-19T19:31:14.143Z',
      name: 'TP-LINK',
      description: 'Tp-link',
      status: true,
    },
    description: 'Brand of the product',
  })
  brand: Brand;

  @ApiProperty({
    example: 'product 1',
    description: 'Name of the product',
  })
  name: string;

  @ApiProperty({
    example: '[pewrjjnwqcxz',
    description: 'Description of the product',
  })
  description: string;

  @ApiProperty({
    example: 89,
    description: 'Available stock quantity',
  })
  stock: number;

  @ApiProperty({
    example: '100',
    description: 'Price of the product',
  })
  price: string;

  @ApiProperty({
    example: 'https://www.google.com',
    description: 'URL to the product image',
  })
  image: string;

  @ApiProperty({
    example: true,
    description: 'Product availability status',
  })
  status: boolean;
}
