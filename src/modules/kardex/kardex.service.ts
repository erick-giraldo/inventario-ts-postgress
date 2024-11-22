import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MovementRepository } from '../movement/movement.repository';
import { ProductRepository } from '../product/product.repository';
import { DateTime } from 'luxon';
export interface KardexEntry {
  item: number;
  date: string;
  detail: string;
  article: string;
  inputs: { provider: string; quantity: number } | null;
  outputs: { client: string; quantity: number } | null;
  balance: number;
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

  async getKardexReport(
    productId: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      // Validar productId
      if (!productId) {
        throw new Error('Product ID is required');
      }

      // Obtener el rango de fechas
      const { start, end } = this.getDateRange(startDate, endDate);

      // Buscar el producto
      const product = await this.productRepository.getById(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
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
        productId,
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
      throw new Error(`Failed to generate Kardex report: ${error.message}`);
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
    movements: any[],
    product: any,
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
        detail: movement.detail || '',
        article: `${product.name}${product.brand ? `, ${product.brand}` : ''}`,
        inputs:
          movement.type === 'IN'
            ? {
                provider: movement.provider || '',
                quantity: movement.quantity,
              }
            : null,
        outputs:
          movement.type === 'OUT'
            ? {
                client: movement.client || '',
                quantity: movement.quantity,
              }
            : null,
        balance,
      };
    });

    return { kardex, finalBalance: balance };
  }

  private calculateTotals(movements: any[]) {
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
}
