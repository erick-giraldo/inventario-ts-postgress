import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'typeorm';
import { Category } from 'src/modules/category/category.entity';
import { Brand } from 'src/modules/brand/brand.entity';

export class ReturnProductDto {
  @ApiProperty({
    example: '607d2f2300e8e38b0a1d24f9',
    description: 'Unique identifier of the product',
  })
  id?: ObjectId | undefined;

  @ApiProperty({
    example: '2024-11-10T03:50:57.712Z',
    description: 'Timestamp when the product was created',
  })
  createdAt?: Date | undefined;

  @ApiProperty({
    example: '2024-11-10T03:50:57.712Z',
    description: 'Timestamp when the product was last updated',
  })
  updatedAt?: Date | undefined;

  @ApiProperty({
    example: { id: '673028e6fd640a8d959c5130', name: 'Electronics' },
    description: 'Category of the product',
  })
  category: Category;

  @ApiProperty({
    example: '12345ABC',
    description: 'Unique product code',
  })
  code: string;

  @ApiProperty({
    example: { id: '673028e6fd640a8d959c5130', name: 'Apple' },
    description: 'Brand of the product',
  })
  brand: Brand;

  @ApiProperty({
    example: 'iPhone 13',
    description: 'Name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Latest model of iPhone with 128GB storage',
    description: 'Description of the product',
  })
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Available stock quantity',
  })
  stock: number;

  @ApiProperty({
    example: 999.99,
    description: 'Price of the product in USD',
  })
  price: number;

  @ApiProperty({
    example: 'https://example.com/iphone13.jpg',
    description: 'URL to the product image',
  })
  image: string;

  @ApiProperty({
    example: true,
    description: 'Product availability status',
  })
  status: boolean;
}
