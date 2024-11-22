import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, Matches, Validate } from 'class-validator';
import { ValidateMobileNumber } from '../validators/validate-mobile-number';
import { NaturalDocumentType } from '@/common/enums/document-type.enum';

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  names: string;

  @ApiProperty()
  @IsString()
  surnames: string;

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
  mobileNumber: string;

  @ApiProperty({ enum: NaturalDocumentType })
  @IsEnum(NaturalDocumentType)
  documentType: NaturalDocumentType;

  @ApiProperty()
  @IsString()
  documentNumber: string;
}
