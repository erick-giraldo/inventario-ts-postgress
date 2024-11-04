import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class EnableTwoFaDto {
  @ApiProperty({ pattern: '^[0-9]{6}$' })
  @IsString()
  twoFaCode: string
}