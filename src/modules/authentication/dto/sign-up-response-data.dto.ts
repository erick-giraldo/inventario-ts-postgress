import { ApiProperty } from '@nestjs/swagger';
import { withBaseResponse } from '../../../utils/with-base-response';

class SignUpResponseDataDto {
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

}

export class SignUpResponseDto extends withBaseResponse(
  SignUpResponseDataDto,
) {}
