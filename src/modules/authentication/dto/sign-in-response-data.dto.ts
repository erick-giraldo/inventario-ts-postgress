import { ApiProperty } from '@nestjs/swagger';
import { ReturnUserDto } from '../../user/dto/return-user.dto';
import { withBaseResponse } from '../../../utils/with-base-response';
import { Type } from 'class-transformer';

class SignInResponseDataDto {
  @ApiProperty({ format: 'uuid' })
  sessionId: string

  @ApiProperty({ type: ReturnUserDto })
  @Type(() => ReturnUserDto)
  user: ReturnUserDto
}

export class SignInResponseDto extends withBaseResponse(SignInResponseDataDto) {}