import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, ValidateIf } from 'class-validator';

export class RequestResetPasswordDto {
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
}