import { ApiProperty } from '@nestjs/swagger';
import { NaturalDocumentType } from '@/common/enums/document-type.enum';
import { Client } from '../client.entity';

export class ReturnClientDto implements Client {
  @ApiProperty({
    example: 'Jhon Alex',
    description: 'Name of the client',
  })
  names: string;

  @ApiProperty({
    example: 'Doe Smith',
    description: 'Surnames of the client',
  })
  surnames: string;

  @ApiProperty({
    example: 'contact@acme.com',
    description: 'Email address of the supplier',
  })
  email: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Mobile number of the supplier',
  })
  mobileNumber: string;

  @ApiProperty({
    example: NaturalDocumentType.ID,
    description: 'Type of identification document',
    enum: NaturalDocumentType,
  })
  documentType: NaturalDocumentType;

  @ApiProperty({
    example: '40405020',
    description: 'Identification document number',
  })
  documentNumber: string;

  @ApiProperty({
    example: true,
    description: 'Status of the supplier',
  })
  status: boolean;
}
