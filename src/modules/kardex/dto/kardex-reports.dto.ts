import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';

export class KardexReportsDto {
  @ApiProperty({
    description: 'ID of the product (e.g., MongoDB ObjectId).',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString({ message: 'Product must be a valid string.' })
  @Matches(/^[0-9a-fA-F]{24}$/, {
    message: 'Product must be a valid ObjectId.',
  })
  productId: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  endDate: string;

  checkDates() {
    if (new Date(this.startDate) > new Date(this.endDate)) {
      throw new UnprocessableEntityException({
        message: 'Validation error',
        data: [
          {
            property: 'from',
            errors: ['startDate must be less than endDate'],
          },
          {
            property: 'endDate',
            errors: ['endDate must be greater than startDate'],
          },
        ],
      });
    }
  }
}
