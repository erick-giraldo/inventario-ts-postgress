import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  Min,
  IsBoolean,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ format: '67302da12656f969ecfdea42' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ format: '67302da12656f969ecfdea42' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock must be a positive number' })
  stock?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be a positive number' })
  price?: number;

  @ApiProperty()
  @IsOptional()
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
