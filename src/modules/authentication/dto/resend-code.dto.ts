import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResendCodeDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  emailAddress: string
}