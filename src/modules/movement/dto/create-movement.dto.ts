import { InvoiceType } from '@/common/enums/invoice-type.enum copy';
import { MovementType } from '@/common/enums/movement-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateMovementDto {
  @ApiProperty({
    enum: MovementType,
    description: 'Type of movement (e.g., IN, OUT).',
  })
  @IsEnum(MovementType, { message: 'Type must be a valid MovementType value.' })
  type: MovementType;

  @ApiProperty({ format: 'uuid' })
  @IsUUID(4)
  product: string;

  @ApiProperty({ description: 'Quantity of the product.' })
  @IsNumber({}, { message: 'Quantity must be a valid number.' })
  @Min(0, { message: 'Quantity must be a positive number.' })
  quantity: number;

  @ApiProperty({ enum: InvoiceType, description: 'Type of invoice.' })
  @IsEnum(InvoiceType, {
    message: 'InvoiceType must be a valid InvoiceType value.',
  })
  invoiceType: InvoiceType;

  @ApiProperty({ description: 'Series of the invoice.' })
  @IsString({ message: 'InvoiceSeries must be a valid string.' })
  invoiceSeries: string;

  @ApiProperty({ description: 'Number of the invoice.' })
  @IsString({ message: 'InvoiceNumber must be a valid string.' })
  invoiceNumber: string;

  @ApiProperty({ description: 'Date of the movement in ISO format.' })
  @IsDateString({}, { message: 'Date must be a valid ISO 8601 string.' })
  date: string;

  @ApiProperty({ description: 'Supplier or client related to the movement.' })
  @IsString({ message: 'SupplierOrClient must be a valid string.' })
  supplierOrClient: string;

  @ApiProperty({ description: 'Unit price of the product.' })
  @IsNumber({}, { message: 'UnitPrice must be a valid number.' })
  @Min(0, { message: 'UnitPrice must be a positive number.' })
  unitPrice: number;

  @ApiProperty({ description: 'IGV (tax) applied to the product.' })
  @IsNumber({}, { message: 'Igv must be a valid number.' })
  @Min(0, { message: 'Igv must be a positive number.' })
  igv: number;

  @ApiProperty({ description: 'Description of the movement.' })
  @IsString({ message: 'Description must be a valid string.' })
  description: string;
}
