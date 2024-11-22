import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { KardexService } from './kardex.service';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { KardexReportsDto } from './dto/kardex-reports.dto';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  async getKardex(@Query() kardexReportsDto: KardexReportsDto) {
    return await this.kardexService.getKardexReport(
      kardexReportsDto.productId,
      kardexReportsDto.startDate,
      kardexReportsDto.endDate,
    );
  }
}
