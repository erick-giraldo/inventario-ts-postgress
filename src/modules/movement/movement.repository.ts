import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { ProductRepository } from '../product/product.repository';
import { CategoryRepository } from '../category/category.repository';
import { BrandRepository } from '../brand/brand.repository';
// import { DateFilter } from '../kardex/interface/kardex-reports.interface';
import { SupplierRepository } from '../supplier/supplier.repository';
import { CustomerRepository } from '../customer/customer.repository';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';
@Injectable()
export class MovementRepository
  extends Repository<Movement>
  implements IRepository<Movement>
{
  constructor(
    @InjectDataSource() dataSource: DataSource,
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
    private readonly supplierRepository: SupplierRepository,
    private readonly customerRepository: CustomerRepository,
  ) {
    super(Movement, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Movement & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Movement & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(id: string, entity: Omit<Partial<Movement>, keyof AbstractEntity>): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // async findAll(dateFilter: DateFilter){
  //   const items = await this.find({
  //     where: dateFilter,
  //     order: { date: 'ASC' },
  //   });

  //   // Si no hay items, retornar array vacío en lugar de undefined
  //   if (!items) return [];

  //   // Retornar directamente el array transformado
  //   return Promise.all(
  //     items.map(async (item) => {
  //       const supplierOrClient =
  //         item.type === MovementType.IN
  //           ? await this.supplierRepository.findOne({
  //               where: { _id: new ObjectId(item.supplierOrClient) },
  //             })
  //           : item.type === MovementType.OUT
  //             ? await this.customerRepository.findOne({
  //                 where: { _id: new ObjectId(item.supplierOrClient) },
  //               })
  //             : null;

  //       return {
  //         ...item,
  //         supplierOrClient,
  //       };
  //     }),
  //   );
  // }

  async store(movement: Movement) {
    return await this.save(movement);
  }

  async getById(id: string) {
    return await this.findOne({ where: { id } });
  }
}
