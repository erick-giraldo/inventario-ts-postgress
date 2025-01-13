import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ParseError, parsePhoneNumberWithError } from 'libphonenumber-js';
import { CreateCustomerDto } from '../dto/create-customer.dto';

type ErrorMessageKey =
  | 'NOT_A_NUMBER'
  | 'INVALID_COUNTRY'
  | 'TOO_SHORT'
  | 'TOO_LONG'
  | 'INVALID_GENERAL';

@ValidatorConstraint({ name: 'ValidateMobileNumber', async: false })
export class ValidateMobileNumber implements ValidatorConstraintInterface {
  private readonly errorMessages: Record<ErrorMessageKey, string> = {
    NOT_A_NUMBER: 'mobileNumber is not a valid mobile number',
    INVALID_COUNTRY: 'mobileNumber has an invalid country code',
    TOO_SHORT: 'mobileNumber is too short',
    TOO_LONG: 'mobileNumber is too long',
    INVALID_GENERAL: 'mobileNumber is not a valid mobile phone number',
  };

  private validatePhoneNumber(phoneNumber: string): boolean {
    try {
      const parsedNumber = parsePhoneNumberWithError(phoneNumber);
      return parsedNumber.isValid();
    } catch {
      return false;
    }
  }

  validate(mobileNumber: string, args: ValidationArguments): boolean {
    const dto = args.object as CreateCustomerDto;
    const numberToValidate = mobileNumber || dto.mobileNumber;

    if (!numberToValidate) {
      return false;
    }

    return this.validatePhoneNumber(numberToValidate);
  }

  defaultMessage(args: ValidationArguments): string {
    const dto = args.object as CreateCustomerDto;
    const numberToValidate = dto.mobileNumber;

    if (!numberToValidate) {
      return this.errorMessages.INVALID_GENERAL;
    }

    try {
      const parsedNumber = parsePhoneNumberWithError(numberToValidate);
      if (!parsedNumber.isValid()) {
        return this.errorMessages.INVALID_GENERAL;
      }
    } catch (error) {
      if (error instanceof ParseError) {
        const errorKey = error.message as ErrorMessageKey;
        if (errorKey in this.errorMessages) {
          return this.errorMessages[errorKey];
        }
        return this.errorMessages.NOT_A_NUMBER;
      }
      return this.errorMessages.INVALID_GENERAL;
    }

    return this.errorMessages.NOT_A_NUMBER;
  }
}
