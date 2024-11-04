import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  fullName: string;

  @ApiProperty({ format: 'email' })
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortProfile?: 'owner' | 'viewer';
}
