import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';
import { EnableTwoFaDto } from './enable-two-fa.dto';

export class UpdatePasswordDto extends EnableTwoFaDto {
  @ApiProperty({ format: 'password' })
  @IsString()
  currentPassword: string

  @ApiProperty({ format: 'password' })
  @IsStrongPassword()
  @IsString()
  newPassword: string
}