import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../brand.entity';

export class ReturnBrandDto implements Brand {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;
}