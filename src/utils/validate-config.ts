import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from '@/common/config/environment-variables';
import { validateSync } from 'class-validator';
import { mapValidationError } from './map-validation-error';

export function validateConfig(config: Record<string, string>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true
  })
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: true
  })
  if (errors.length) {
    throw new Error(errors.map(it => {
      return mapValidationError(it).errors
    }).join('\n\t'))
  }

  return validatedConfig
}