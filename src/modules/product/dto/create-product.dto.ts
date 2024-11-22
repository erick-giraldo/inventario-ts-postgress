import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUrl,
  IsNumber,
  Min,
  Length,
  Matches,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'ID of the category (e.g., MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: 'Category must be a valid string.' })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Category must be a valid ObjectId.',
  })
  category: string;

  @ApiProperty({ description: 'Unique code of the product.' })
  @IsString({ message: 'Code must be a valid string.' })
  @Length(3, 20, { message: 'Code must be between 3 and 20 characters.' })
  code: string;

  @ApiProperty({
    description: 'ID of the brand (e.g., MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: 'Brand must be a valid string.' })
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Brand must be a valid ObjectId.' })
  brand: string;

  @ApiProperty({ description: 'Name of the product.' })
  @IsString({ message: 'Name must be a valid string.' })
  @Length(3, 100, { message: 'Name must be between 3 and 100 characters.' })
  name: string;

  @ApiProperty({ description: 'Detailed description of the product.' })
  @IsString({ message: 'Description must be a valid string.' })
  @Length(5, 500, {
    message: 'Description must be between 5 and 500 characters.',
  })
  description: string;

  @ApiProperty({ description: 'Available stock of the product.' })
  @IsNumber({}, { message: 'Stock must be a valid number.' })
  @Min(0, { message: 'Stock must be a positive number.' })
  stock: number;

  @ApiProperty({ description: 'Price of the product.' })
  @IsNumber({}, { message: 'Price must be a valid number.' })
  @Min(0, { message: 'Price must be a positive number.' })
  price: number;

  @ApiProperty({ description: 'URL of the product image.' })
  @IsUrl({}, { message: 'Image must be a valid URL.' })
  image: string;

  @ApiProperty({ description: 'Status of the product (optional).' })
  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value.' })
  status?: boolean;
}
