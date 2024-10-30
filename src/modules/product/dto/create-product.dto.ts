import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateProductDto{
  @ApiProperty()
  address: string;

  @ApiProperty({ format: 'uuid' })
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty({ format: 'uuid' })
  @IsString()
  brandId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  stock: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  status: boolean;
}