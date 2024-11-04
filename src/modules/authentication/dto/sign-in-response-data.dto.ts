import { ApiProperty } from '@nestjs/swagger';

import { withBaseResponse } from '../../../utils/with-base-response';
import { Type } from 'class-transformer';
import { ReturnUserDto } from 'src/modules/user/dto/return-user.dto';

class SignInResponseDataDto {
  @ApiProperty({ format: 'uuid' })
  sessionId: string

  @ApiProperty({ type: ReturnUserDto })
  @Type(() => ReturnUserDto)
  user: ReturnUserDto
}

export class SignInResponseDto extends withBaseResponse(SignInResponseDataDto) {}