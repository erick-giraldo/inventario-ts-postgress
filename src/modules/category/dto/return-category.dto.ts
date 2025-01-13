import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../category.entity';

export class ReturnCategoryDto implements Category {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: boolean;
}