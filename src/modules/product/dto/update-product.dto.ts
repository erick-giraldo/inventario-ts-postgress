import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsUrl,
  IsNumber,
  Min,
  IsBoolean,
  Matches,
  ValidateIf,
} from 'class-validator';
import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class UpdateProductDto {
  @ApiProperty({
    description: 'ID of the category (e.g., MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString({ message: 'Category must be a valid string.' })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Category must be a valid ObjectId.',
  })
  category?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    description: 'ID of the brand (e.g., MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsOptional()
  @IsString({ message: 'Brand must be a valid string.' })
  @Matches(/^[0-9a-fA-F]{24}$/, { message: 'Brand must be a valid ObjectId.' })
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
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Stock must be a valid number' })
  @Min(0, { message: 'Stock must be a positive number' })
  stock?: number;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({}, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price must be a positive number' })
  price?: number;

  @ApiProperty({
    description: 'Product image (optional). If not provided, it can be a URL (string).',
    required: false,
  })
  @IsOptional()
  @ValidateIf((o) => typeof o.image !== 'string') // Solo valida si 'image' no es un string
  @IsFile() // Solo valida si es un archivo
  @MaxFileSize(10 * 1024 * 1024) // Tamaño máximo de 10 MB
  @HasMimeType(['image/jpg', 'image/jpeg', 'image/png']) // Tipos de archivo permitidos
  image?: Express.Multer.File | string;

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  status?: boolean;
}
