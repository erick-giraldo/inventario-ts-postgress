import { AbstractEntity } from '@/common/entities/abstract.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, Validate } from 'class-validator';
import { ValidateMobileNumber } from '../validators/validate-mobile-number';
import { CorporateDocumentType } from '@/common/enums/document-type.enum';

export class UpdateSupplierDto extends AbstractEntity{
  @ApiProperty()
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  contact?: string;
  
  @ApiProperty({
    description: 'Email address must be from a non-disposable domain'
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
  mobileNumber?: string

  @ApiProperty({ enum: CorporateDocumentType })
  @IsOptional()
  @IsEnum(CorporateDocumentType)
  documentType?: CorporateDocumentType;

  @ApiProperty()
  @IsOptional()
  @IsString()
  documentNumber?: string;
}