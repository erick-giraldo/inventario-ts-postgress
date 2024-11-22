import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Matches, Validate } from 'class-validator';
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

function IsStartDateBeforeEndDate(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
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
  @IsStartDateBeforeEndDate('endDate', {
    message: 'startDate must be less than or equal to endDate.',
  })
  startDate: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  endDate: string;
}
