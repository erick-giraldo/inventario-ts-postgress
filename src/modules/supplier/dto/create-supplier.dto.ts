import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, Validate } from 'class-validator';
import { ValidateMobileNumber } from '../validators/validate-mobile-number';
import { CorporateDocumentType } from '@/common/enums/document-type.enum';

export class CreateSupplierDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  contact: string;

  @ApiProperty({
    description: 'Email address must be from a non-disposable domain',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Mobile number in international format',
    pattern: '/^\\+[0-9]{2}[0-9]{2,}$/',
  })
  @IsString()
  @Validate(ValidateMobileNumber)
  // @Matches(/^\+[0-9]{2}[0-9]{2,}$/)
  mobileNumber: string;

  @ApiProperty({ enum: CorporateDocumentType })
  @IsEnum(CorporateDocumentType)
  documentType: CorporateDocumentType;

  @ApiProperty()
  @IsString()
  documentNumber: string;
}
