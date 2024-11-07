import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, ValidateIf } from 'class-validator';

export class SignInDto {
  // @ApiProperty({
  //   description: 'Required if `username` is not provided',
  //   required: false,
  // })
  // @ValidateIf((it) => !it.emailAddress)
  // @IsString()
  // username?: string;

  @ApiProperty({
    description: 'Required if `emailAddress` is not provided',
    required: false,
  })
  @ValidateIf((it) => !it.username)
  @IsEmail()
  emailAddress?: string;

  @ApiProperty({ format: 'password' })
  @IsString()
  password: string;

  // @ApiProperty({
  //   description: 'Required if 2FA is enabled',
  //   required: false,
  //   pattern: '^[0-9]{6}$',
  // })
  // @IsString()
  // @IsOptional()
  // twoFaCode?: string;
}

export class SignInAPIDto {
  @ApiProperty({
    description: 'Required API key',
    required: false,
  })
  @IsString()
  apiKey: string;
}
