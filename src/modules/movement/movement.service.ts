import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementRepository } from './movement.repository';
import { ProductService } from '../product/product.service';
import { MovementType } from '@/common/enums/movement-type.enum';
import { PaginateQuery } from 'nestjs-paginate';
import { FindOptionsWhere } from 'typeorm';
import { EntityWithId } from '@/common/types/types';
import { User } from '../user/user.entity';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementRepository)
    private movementRepository: MovementRepository,
    private readonly productService: ProductService,
  ) {}

  async getPaginate(query: PaginateQuery) {
    const limit = query.limit ?? 10;
    const page = query.page ?? 1;
    const sort =
      query.sortBy?.reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]: value,
        };
      }, {}) || {};

    const paginated = await this.movementRepository.findPaginated(
      page,
      limit,
      sort as Record<keyof Movement, 'ASC' | 'DESC'>,
      query.filter as FindOptionsWhere<Movement>,
    );

    return {
      results: paginated.items,
      meta: {
        itemsPerPage: limit,
        totalItems: paginated.count,
        currentPage: page,
        totalPages: Math.ceil(paginated.count / limit),
      },
    };
  }

  async getById(id: string) {
    const found = await this.movementRepository.getById(id);
    if (!found) {
      throw new ConflictException({ message: 'Movement does not exist' });
    }
    return found;
  }

  private validateMovementData(movementData: CreateMovementDto): void {
    if (!movementData.product) {
      throw new BadRequestException('Product is required');
    }

    if (!movementData.quantity || movementData.quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive number');
    }

    if (!Object.values(MovementType).includes(movementData.type)) {
      throw new BadRequestException('Invalid movement type');
    }
  }

  private calculateNewStock(
    currentStock: number,
    quantity: number,
    movementType: MovementType,
  ): number {
    return movementType === MovementType.IN
      ? currentStock + quantity
      : currentStock - quantity;
  }

  private validateStockChange(
    currentStock: number,
    newStock: number,
    movementType: MovementType,
  ): void {
    if (movementType === MovementType.OUT && newStock < 0) {
      throw new BadRequestException('Insufficient stock for this movement');
    }

    if (newStock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }
  }

  async createMovement(
    movementData: CreateMovementDto,
    user: EntityWithId<User>,
  ): Promise<Movement> {
    console.log("🚀 ~ MovementService ~ user:", user)
    try {
      this.validateMovementData(movementData);

      const product = await this.productService.getById(movementData.product);

      if (!product) {
        throw new BadRequestException('Product not found');
      }

      const unitPrice = Number(movementData.unitPrice);
      const igvRate = Number(movementData.igv);
      const currentStock = Number(product.stock);
      const quantity = Number(movementData.quantity);

      if (quantity < 0) {
        throw new Error('quantity cannot be negative.');
      }

      const updatedStock = this.calculateNewStock(
        currentStock,
        quantity,
        movementData.type,
      );

      this.validateStockChange(currentStock, updatedStock, movementData.type);

      // await this.productService.update(product.id!.toString(), {
      //   stock: updatedStock,
      // });
      const movement = this.movementRepository.create({
        ...movementData,
        date: movementData.date,
        previousStock: currentStock,
        newStock: updatedStock,
        netPrice: _.round(unitPrice * (1 + igvRate), 2),
        user: user.id
      });

      const savedMovement = await this.movementRepository.save(movement);

      //crear un log para guardar un historico
      //this.logger.log(`Movement created: ${JSON.stringify(savedMovement)}`);

      return savedMovement;
    } catch (error) {
      console.log('🚀 ~ MovementService ~ createMovement ~ error:', error);
      throw new BadRequestException(
        `Failed to create movement: ${error.message}`,
      );
    }
  }
}
