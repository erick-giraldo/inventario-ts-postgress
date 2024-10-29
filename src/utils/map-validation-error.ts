import { ValidationError } from '@nestjs/common';
import { IMappedError } from './mapped-error';

export function mapValidationError(e: ValidationError): IMappedError {
  return {
    property: e.property,
    errors: e.children?.length
      ? e.children.map(mapValidationError)
      : Object.values(e.constraints!)
  }
}