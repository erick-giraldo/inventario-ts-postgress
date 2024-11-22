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

@Controller('kardex')
export class KardexController {
  constructor(private readonly kardexService: KardexService) {}

  @Get(':productId')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  async getKardex(@Query() kardexReportsDto: KardexReportsDto) {
    return await this.kardexService.getKardexReport(kardexReportsDto);
  }

  @Get('export/now')
  @ApiOperation({
    summary: 'Export a XLSX file with the trades',
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
  async downloadKardexReport(
    @Query() kardexReportsDto: KardexReportsDto,
    @Res() res: Response,
  ) {
    console.log("ddddddd")
    const { filename, buffer } =
      await this.kardexService.exportKardexReport(kardexReportsDto);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    res.send(buffer);
  }
}
