import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementRepository } from '../movement/movement.repository';
import { ProductRepository } from '../product/product.repository';
import { DateTime } from 'luxon';
import { KardexReportsDto } from './dto/kardex-reports.dto';
import * as xlsx from 'xlsx';
import { Movement } from '../movement/movement.entity';
import { Product } from '../product/product.entity';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { ObjectId } from 'typeorm';

export interface IProduct {
  category: Category | null;
  brand: Brand | null;
  code: string;
  name: string;
  description: string;
  stock: number;
  price: number;
  image: string;
  status?: boolean;
  id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface KardexEntry {
  item: number;
  date: string;
  detail: string;
  article: string;
  inputs: { provider: string; quantity: number } | null;
  outputs: { client: string; quantity: number } | null;
  balance: number;
}

interface KardexReportData {
  Ítem: number;
  Fecha: any;
  Detalle: any;
  Artículo: string;
  Proveedor: any;
  Entradas: any;
  Cliente: any;
  Salidas: any;
  Saldo: any;
  [key: string]: any; // Firma de índice para permitir claves dinámicas
}

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

    // Validar que start no sea posterior a end
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
      // Validar productId
      if (!kardexReportsDto) {
        throw new Error('Product ID is required');
      }

      // Obtener el rango de fechas
      const { start, end } = this.getDateRange(
        kardexReportsDto.startDate,
        kardexReportsDto.endDate,
      );

      // Buscar el producto
      const product = await this.productRepository.getById(
        kardexReportsDto.productId,
      );
      if (!product) {
        throw new Error(
          `Product with ID ${kardexReportsDto.productId} not found`,
        );
      }

      // Construir el filtro de fechas para la consulta
      const dateFilter = {
        date: {
          $gte: start.toJSDate(),
          $lte: end.toJSDate(),
        },
      };

      // Obtener los movimientos
      const movements = await this.movementRepository.find({
        where: dateFilter,
        order: { date: 'ASC' },
      });

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
        },
      };
    } catch (error) {
      throw new BadRequestException(`Failed to generate Kardex report: ${error.message}`);
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
    movements: Movement[],
    product: IProduct,
    initialBalance: number,
  ): { kardex: KardexEntry[]; finalBalance: number } {
    let balance = initialBalance;

    const kardex = movements.map((movement, index) => {
      // Actualizar balance
      balance =
        movement.type === 'IN'
          ? balance + movement.quantity
          : balance - movement.quantity;

      return {
        item: index + 1,
        date: DateTime.fromJSDate(movement.date).toFormat('yyyy-MM-dd'),
        detail: movement.description || '',
        article: product.name,
        inputs:
          movement.type === 'IN'
            ? {
                provider: movement.supplierOrClient || '',
                quantity: movement.quantity,
              }
            : null,
        outputs:
          movement.type === 'OUT'
            ? {
                client: movement.supplierOrClient || '',
                quantity: movement.quantity,
              }
            : null,
        balance,
      };
    });

    return { kardex, finalBalance: balance };
  }

  private calculateTotals(movements: Movement[]) {
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

  private applyNumericFormat(
    sheet: xlsx.WorkSheet,
    column: string,
    format: { numFmt: string },
  ) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:A1');
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cellAddress = { c: xlsx.utils.decode_col(column), r: R };
      const cellRef = xlsx.utils.encode_cell(cellAddress);
      const cell = sheet[cellRef];
      if (cell) {
        cell.z = format.numFmt;
      }
    }
  }

  private applyDateFormat(
    sheet: xlsx.WorkSheet,
    column: string,
    dateFormat: { dateFormat: string },
  ) {
    const range = xlsx.utils.decode_range(sheet['!ref'] || 'A1:A1');
    for (let rowNum = range.s.r; rowNum <= range.e.r; rowNum++) {
      const cell =
        sheet[
          xlsx.utils.encode_cell({
            r: rowNum,
            c: xlsx.utils.decode_col(column),
          })
        ];
      if (cell && cell.t === 'n' && xlsx.SSF.is_date(dateFormat)) {
        cell.t = 'd';
        cell.z = dateFormat;
      }
    }
  }


  async exportKardexReport(kardexReportsDto: KardexReportsDto) {
    try {
      // Generar el reporte de Kardex
      const reportData = await this.getKardexReport(kardexReportsDto);
      console.log("🚀 ~ KardexService ~ exportKardexReport ~ reportData:", reportData)
  
      const allowedKeys = [
        'Ítem',
        'Fecha',
        'Detalle',
        'Artículo',
        'Proveedor',
        'Entradas',
        'Cliente',
        'Salidas',
        'Saldo',
      ];
  
      const promises = reportData.report.map(async (movement: any, index: number) => {
        const processedData: KardexReportData = {
          Ítem: index + 1,
          Fecha: DateTime.fromISO(movement.date.replace(' ', 'T'),
          ).toFormat('dd/MM/yyyy'),
          Detalle: movement.description || '',
          Artículo: `${movement.articleName}, ${movement.articleBrand}`,
          Proveedor: movement.provider || '',
          Entradas: movement.entries || '',
          Cliente: movement.client || '',
          Salidas: movement.exits || '',
          Saldo: movement.balance,
        };
  
        return Object.keys(processedData)
          .filter((key) => allowedKeys.includes(key))
          .reduce((obj: Record<string, any>, key: string) => {
            obj[key] = processedData[key];
            return obj;
          }, {} as Record<string, any>);
      });
  
      const newResult = await Promise.all(promises);
  
      // Crear el libro y la hoja de Excel
      const workbook = xlsx.utils.book_new();
      const worksheet = xlsx.utils.json_to_sheet(newResult);
  
      // Formatos numéricos personalizados
      const numericFormats = [
        { column: 'E', numFmt: '#,##0.00' }, // Entradas
        { column: 'H', numFmt: '#,##0.00' }, // Salidas
        { column: 'I', numFmt: '#,##0.00' }, // Saldo
      ];
  
      numericFormats.forEach(({ column, numFmt }) => {
        this.applyNumericFormat(worksheet, column, { numFmt });
      });

      const dateFormats = [
        { column: 'B', dateFormat: 'dd-MM-yyyy HH:mm:ss' }
      ];
  
      dateFormats.forEach(({ column, dateFormat }) => {
        this.applyDateFormat(worksheet, column, { dateFormat });
      });
  
  
      // Añadir la hoja al libro
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Kardex Report');
  
      // Generar el buffer del archivo Excel
      const excelBuffer = xlsx.write(workbook, {
        type: 'buffer',
        bookType: 'xlsx',
      });
  
      // Devolver el archivo con nombre y buffer
      return {
        filename: `kardex_report_${Date.now()}.xlsx`,
        buffer: excelBuffer,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to export Kardex report: ${error.message}`,
      );
    }
  }
  
}
