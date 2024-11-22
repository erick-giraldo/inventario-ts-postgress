import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  Validate,
} from 'class-validator';
import { ValidateMobileNumber } from '../validators/validate-mobile-number';
import { NaturalDocumentType } from '@/common/enums/document-type.enum';

export class UpdateClientDto extends AbstractEntity {
  @ApiProperty()
  @IsOptional()
  @IsString()
  names?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  surnames?: string;

  @ApiProperty({
    description: 'Email address must be from a non-disposable domain',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Mobile number in international format',
    pattern: '/^\\+[0-9]{2}[0-9]{2,}$/',
  })
  @IsOptional()
  @IsString()
  @Validate(ValidateMobileNumber)
  @Matches(/^\+[0-9]{2}[0-9]{2,}$/)
  mobileNumber?: string;

  @ApiProperty({ enum: NaturalDocumentType })
  @IsOptional()
  @IsEnum(NaturalDocumentType)
  documentType?: NaturalDocumentType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentNumber?: string;
}
