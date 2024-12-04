import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementRepository } from '../movement/movement.repository';
import { ProductRepository } from '../product/product.repository';
import { DateTime } from 'luxon';
import { KardexReportsDto } from './dto/kardex-reports.dto';
import XlsxTemplate from 'xlsx-template';
import * as path from 'path';
import * as fs from 'fs';
import {
  DateFilter,
  IProduct,
  KardexEntry,
} from './interface/kardex-reports.interface';
import { IMovement } from '../movement/interface/movement.interface';
import { Supplier } from '../supplier/supplier.entity';
import { Client } from '../client/client.entity';
@Injectable()
export class KardexService {
  constructor(
    @InjectRepository(MovementRepository)
    private readonly movementRepository: MovementRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  private parseDateString(dateString: string): DateTime {
    return DateTime.fromISO(dateString);
  }

  private getDateRange(startDate?: string, endDate?: string) {
    const now = DateTime.now();
    const start = startDate
      ? this.parseDateString(startDate)
      : now.startOf('month');
    const end = endDate ? this.parseDateString(endDate) : now.endOf('month');

    if (start > end) {
      throw new Error('Start date cannot be after end date');
    }

    return {
      start: start.startOf('day'),
      end: end.endOf('day'),
    };
  }

  async getKardexReport(kardexReportsDto: KardexReportsDto) {
    try {
      if (!kardexReportsDto) {
        throw new Error('Product ID is required');
      }

      const { start, end } = this.getDateRange(
        kardexReportsDto.startDate,
        kardexReportsDto.endDate,
      );

      const product = await this.productRepository.getById(
        kardexReportsDto.productId,
      );
      if (!product) {
        throw new Error(
          `Product with ID ${kardexReportsDto.productId} not found`,
        );
      }
      const startString = start.toFormat('yyyy-MM-dd');
      const endString = end.toFormat('yyyy-MM-dd');
      const dateFilter: DateFilter = {
        date: {
          $gte: startString,
          $lte: endString,
        },
      };

      const movements: IMovement[] =
        await this.movementRepository.findAll(dateFilter);

      // Procesar los movimientos y calcular el kardex
      const initialBalance = await this.calculateInitialBalance(
        kardexReportsDto.productId,
        start.toJSDate(),
      );

      const { kardex, finalBalance } = this.processMovements(
        movements,
        product,
        initialBalance,
      );

      // Calcular totales
      const totals = this.calculateTotals(movements);

      return {
        report: kardex,
        summary: {
          ...totals,
          finalBalance,
          periodStart: start.toFormat('yyyy-MM-dd'),
          periodEnd: end.toFormat('yyyy-MM-dd'),
          product: `${product.code} - ${product.name}`,
        },
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to generate Kardex report: ${error.message}`,
      );
    }
  }

  private async calculateInitialBalance(
    productId: string,
    startDate: Date,
  ): Promise<number> {
    const previousMovements = await this.movementRepository.find({
      where: {
        productId,
        date: { $lt: startDate },
      },
    });

    return previousMovements.reduce((balance, movement) => {
      return movement.type === 'IN'
        ? balance + movement.quantity
        : balance - movement.quantity;
    }, 0);
  }

  private processMovements(
    movements: IMovement[],
    product: IProduct,
    initialBalance: number,
  ): { kardex: KardexEntry[]; finalBalance: number } {
    const { kardex, finalBalance } = movements.reduce(
      (acc, movement) => {
        const newBalance =
          movement.type === 'IN'
            ? acc.finalBalance + movement.quantity
            : acc.finalBalance - movement.quantity;

        acc.kardex.push({
          date: movement.date,
          detail: movement.description || '',
          product: `${product.code} - ${product.name}`,
          inputs:
            movement.type === 'IN' &&
            movement.supplierOrClient &&
            'companyName' in movement.supplierOrClient
              ? {
                  provider: movement.supplierOrClient as Supplier,
                  quantity: movement.quantity,
                }
              : null,
          outputs:
            movement.type === 'OUT' &&
            movement.supplierOrClient &&
            !('companyName' in movement.supplierOrClient)
              ? {
                  client: movement.supplierOrClient as Client,
                  quantity: movement.quantity,
                }
              : null,
          balance: newBalance,
        });

        return { kardex: acc.kardex, finalBalance: newBalance };
      },
      { kardex: [] as KardexEntry[], finalBalance: initialBalance },
    );

    return { kardex, finalBalance };
  }

  private calculateTotals(movements: IMovement[]) {
    return movements.reduce(
      (totals, movement) => {
        if (movement.type === 'IN') {
          totals.totalInputs += movement.quantity;
        } else {
          totals.totalOutputs += movement.quantity;
        }
        return totals;
      },
      { totalInputs: 0, totalOutputs: 0 },
    );
  }

  async exportKardexReportWithTemplate(kardexReportsDto: KardexReportsDto) {
    try {
      const reportData = await this.getKardexReport(kardexReportsDto);
      const filename = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'assets',
        'templates',
        'kardex_report-template.xlsx',
      );
      const file = await fs.promises.readFile(filename);
      const template = new XlsxTemplate(file);

      const processedData = reportData.report.map((movement) => ({
        date: movement.date,
        detail: movement.detail,
        product: movement.product,
        supplier: movement.inputs?.provider?.companyName || '',
        inputs: movement.inputs ? Math.round(movement.inputs.quantity) : '',
        client: movement.outputs?.client
          ? `${movement.outputs.client.names || ''} ${movement.outputs.client.surnames || ''}`.trim()
          : '',
        outputs: movement.outputs ? Math.round(movement.outputs.quantity) : '',
        balance: Math.round(movement.balance),
      }));
      
      const data = {
        currentDate: DateTime.now()
          .setZone('Etc/GMT+5')
          .toFormat('dd/MM/yyyy HH:mm'),
        data: processedData,
        summary: {
          period: `${reportData.summary.periodStart} a ${reportData.summary.periodEnd}`,
          totalInputs: reportData.summary.totalInputs,
          totalOutputs: reportData.summary.totalOutputs,
          finalBalance: reportData.summary.finalBalance,
          product: reportData.summary.product,
        },
      };

      template.substitute(1, data);

      return {
        filename: `kardex_report_${Date.now()}.xlsx`,
        buffer: template.generate({ type: 'uint8array' }),
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to export Kardex report with template: ${error.message}`,
      );
    }
  }
}
