import { ApiProperty } from '@nestjs/swagger';
import { CorporateDocumentType } from '@/common/enums/document-type.enum';
import { Supplier } from '../supplier.entity';

export class ReturnSupplierDto implements Supplier {
  @ApiProperty({
    example: 'Acme Corp',
    description: 'Name of the company',
  })
  companyName: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Contact person for the supplier',
  })
  contact: string;

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
    example: CorporateDocumentType.RUC,
    description: 'Type of identification document',
    enum: CorporateDocumentType, // Swagger genera documentación de los valores del enum
  })
  documentType: CorporateDocumentType

  @ApiProperty({
    example: '123456789',
    description: 'Identification document number',
  })
  documentNumber: string;

  @ApiProperty({
    example: true,
    description: 'Status of the supplier',
  })
  status: boolean;
}