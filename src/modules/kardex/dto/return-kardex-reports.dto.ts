import { ApiProperty } from '@nestjs/swagger';

class KardexInputsDto {
  @ApiProperty({
    example: 'Jhon Doe',
    description: 'Provider name for the input',
  })
  provider: string;

  @ApiProperty({
    example: 10,
    description: 'Quantity of product received',
  })
  quantity: number;
}

class KardexOutputsDto {
  @ApiProperty({
    example: 'Erick',
    description: 'Client name for the output',
  })
  client: string;

  @ApiProperty({
    example: 3,
    description: 'Quantity of product sold or distributed',
  })
  quantity: number;
}

class KardexReportDetailDto {
  @ApiProperty({
    example: '2024-11-22',
    description: 'Date of the transaction',
  })
  date: string;

  @ApiProperty({
    example: 'compra de router',
    description: 'Detail or description of the transaction',
  })
  detail: string;

  @ApiProperty({
    example: 'TWH-1673U- Router Doble Banda',
    description: 'Product identifier and name',
  })
  product: string;

  @ApiProperty({
    example: { provider: 'Jhon Doe', quantity: 10 },
    description: 'Inputs of the transaction',
  })
  inputs: KardexInputsDto;

  @ApiProperty({
    example: null,
    description: 'Outputs of the transaction, can be null',
  })
  outputs: KardexOutputsDto | null;

  @ApiProperty({
    example: 10,
    description: 'Balance after the transaction',
  })
  balance: number;
}

export class KardexReportDto {
  @ApiProperty({
    type: [KardexReportDetailDto],
    description: 'List of detailed transactions in the Kardex report',
  })
  report: KardexReportDetailDto[];

  @ApiProperty({
    example: {
      totalInputs: 100,
      totalOutputs: 28,
      finalBalance: 72,
      periodStart: '2024-11-01',
      periodEnd: '2024-11-30',
      product: 'TWH-1673U- Router Doble Banda',
    },
    description: 'Summary of the Kardex report',
  })
  summary: {
    totalInputs: number;
    totalOutputs: number;
    finalBalance: number;
    periodStart: string;
    periodEnd: string;
    product: string;
  };
}
