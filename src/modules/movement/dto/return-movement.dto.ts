import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'typeorm';
export class ReturnMovementDto {
  @ApiProperty({
    example: '607d2f2300e8e38b0a1d24f9',
    description: 'Unique identifier of the movement',
  })
  id?: ObjectId | undefined;
  
  @ApiProperty({
    example: '2024-11-10T03:50:57.712Z',
    description: 'Timestamp when the movement was created',
  })
  createdAt?: Date;

  @ApiProperty({
    example: '2024-11-10T03:50:57.712Z',
    description: 'Timestamp when the movement was last updated',
  })
  updatedAt?: Date;

  @ApiProperty({
    example: 'IN',
    description: 'Type of movement, either "IN" or "OUT"',
  })
  type: 'IN' | 'OUT';

  @ApiProperty({
    example: '607d2f2300e8e38b0a1d24f9',
    description: 'Unique identifier of the product associated with the movement',
  })
  product: string;

  @ApiProperty({
    example: 100,
    description: 'Quantity of the product moved',
  })
  quantity: number;

  @ApiProperty({
    example: 'INVOICE',
    description: 'Type of the invoice associated with the movement',
  })
  invoiceType: string;

  @ApiProperty({
    example: 'A001',
    description: 'Series of the invoice',
  })
  invoiceSeries: string;

  @ApiProperty({
    example: '123456',
    description: 'Number of the invoice',
  })
  invoiceNumber: string;

  @ApiProperty({
    example: '2024-11-20T00:00:00.000Z',
    description: 'Date when the movement occurred',
  })
  date: Date;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the supplier or client associated with the movement',
  })
  supplierOrClient: string;

  @ApiProperty({
    example: 50.75,
    description: 'Unit price of the product in the movement',
  })
  unitPrice: number;

  @ApiProperty({
    example: 9.14,
    description: 'IGV (General Sales Tax) applied to the movement',
  })
  igv: number;

  @ApiProperty({
    example: 'Purchase of office supplies',
    description: 'Description of the movement',
  })
  description: string;

  @ApiProperty({
    example: '607d2f2300e8e38b0a1d24f9',
    description: 'Unique identifier of the user who registered the movement',
  })
  user: string;
}
