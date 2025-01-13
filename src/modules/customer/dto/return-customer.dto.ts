import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@/common/enums/document-type.enum';
import { Customer } from '../customer.entity';

export class ReturnCustomerDto implements Customer {
  @ApiProperty({
    example: 'Jhon Alex',
    description: 'Name of the client',
  })
  name: string;
  
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
    example: DocumentType.ID,
    description: 'Type of identification document',
    enum: DocumentType,
  })
  documentType: DocumentType;

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
