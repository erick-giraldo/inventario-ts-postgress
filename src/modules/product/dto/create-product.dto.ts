import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  Matches,
  IsUrl,
  IsNumber,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ format: '67302da12656f969ecfdea42' })
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ format: '67302da12656f969ecfdea42' })
  @IsString()
  brandId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock must be a positive number' })
  stock: number;

  @ApiProperty()
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be a positive number' })
  price: number;

  @ApiProperty()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;

  @ApiProperty()
  @IsOptional()
  status?: boolean;
}
