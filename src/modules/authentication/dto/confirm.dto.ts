import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ pattern: '^[0-9]{3}-[0-9]{3}$' })
  @IsString()
  code: string;
}

export class SetActivateDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ pattern: '^[0-9]{3}-[0-9]{3}$' })
  @IsString()
  code: string;

  @ApiProperty({ format: 'password' })
  @IsString()
  @IsStrongPassword()
  password: string;
}
