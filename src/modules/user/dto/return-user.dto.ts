import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '../user-type.enum';
import { User } from '../user.entity';
import { Exclude } from 'class-transformer';

export class ReturnUserDto implements User {
  @ApiProperty()
  username: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ format: 'email' })
  emailAddress: string;

  @ApiProperty()
  isEmailAddressVerified: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ enum: UserType })
  userType: UserType;

  @Exclude()
  password: string;

  @Exclude()
  twoFaSeed: string | null;
}
