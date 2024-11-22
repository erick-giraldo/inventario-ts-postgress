import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { KardexService } from './kardex.service';
import { Authentication } from '../authentication/decorators/authentication.decorator';
import { KardexReportsDto } from './dto/kardex-reports.dto';
import { Response } from 'express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { KardexReportDto } from './dto/return-kardex-reports.dto';

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkResponse({ type: KardexReportDto })
  async getKardex(@Query() kardexReportsDto: KardexReportsDto) {
    return await this.kardexService.getKardexReport(kardexReportsDto);
  }

  @Get('/export/now')
  @ApiOperation({
    summary: 'Export a XLSX file with the kardex',
  })
  @ApiOkResponse({
    content: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  @Authentication()
  async reportTransactions(
    @Query() kardexReportsDto: KardexReportsDto,
    @Res() res: Response,
  ) {
    const result =
      await this.kardexService.exportKardexReportWithTemplate(kardexReportsDto);

    return res
      .set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${result.filename}"`,
      })
      .end(result.buffer);
  }
}
