import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../user-type.enum';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  emailAddress?: string;

  @ApiProperty()
  @IsOptional()
  isEmailAddressVerified?: boolean;

  @ApiProperty()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty()
  @IsOptional()
  isTwoFaEnabled?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsEnum({ type: 'enum', enum: UserType, default: UserType.CLIENT })
  userType?: UserType;

  @ApiProperty()
  @IsString()
  @IsOptional()
  shortProfile?: 'owner' | 'viewer';
}
