import {
  IsEmail,
  IsString,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName: string

  @ApiProperty({ format: 'password' })
  @IsString()
  @IsStrongPassword()
  password: string

  @ApiProperty({ format: 'email' })
  @IsEmail()
  emailAddress: string

}

