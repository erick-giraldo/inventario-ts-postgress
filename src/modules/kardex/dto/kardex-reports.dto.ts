import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches } from 'class-validator';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import IsRealDate from '../../../modules/movement/validators/is-real-date';

function IsStartDateBeforeEndDate(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStartDateBeforeEndDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!value || !relatedValue) return true; // Let other validations handle missing values
          return new Date(value) <= new Date(relatedValue);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be less than or equal to ${args.constraints[0]}`;
        },
      },
    });
  };
}

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
  @IsRealDate({ message: 'startDate is not a valid calendar date.' })
  @IsStartDateBeforeEndDate('endDate', {
    message: 'startDate must be less than or equal to endDate.',
  })
  startDate: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  @IsRealDate({ message: 'endDate is not a valid calendar date.' })
  endDate: string;
}
