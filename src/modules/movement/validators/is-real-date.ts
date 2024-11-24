import {
    registerDecorator,
    ValidationOptions,
  } from 'class-validator';
  
  // Validador para verificar si la fecha es real
  export default function IsRealDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'isRealDate',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any) {
            if (!value) return true; // Validaciones como @IsNotEmpty manejarán casos vacíos
            const date = new Date(value);
            // Comprobar si el valor dado no genera una fecha inválida
            return (
              date instanceof Date &&
              !isNaN(date.getTime()) &&
              value === date.toISOString().split('T')[0]
            );
          },
          defaultMessage(): string {
            return 'The date $value is not a valid calendar date.';
          },
        },
      });
    };
  }
  