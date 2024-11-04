import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsStrongPassword,
  Matches,
  ValidateIf,
} from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Required if `username` is not provided',
    required: false
  })
  @IsString()
  @ValidateIf((it) => !it.emailAddress)
  username?: string

  @ApiProperty({
    description: 'Required if `emailAddress` is not provided',
    required: false
  })
  @IsEmail()
  @ValidateIf((it) => !it.username)
  emailAddress?: string

  @ApiProperty({ pattern: '/^\\d{3}-\\d{3}$/' })
  @Matches(/^\d{3}-\d{3}$/)
  @IsString()
  code: string

  @ApiProperty({ format: 'password' })
  @IsStrongPassword()
  newPassword: string
}