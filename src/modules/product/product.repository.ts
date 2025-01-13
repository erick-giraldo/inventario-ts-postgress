import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { IRepository } from '@/common/interfaces/repository.interface';
import { AbstractEntity } from '@/common/entities/abstract.entity';
import { CategoryRepository } from '../category/category.repository';
import { BrandRepository } from '../brand/brand.repository';
@Injectable()
export class ProductRepository
  extends Repository<Product>
  implements IRepository<Product>
{
  constructor(
    @InjectDataSource() dataSource: DataSource,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {
    super(Product, dataSource.createEntityManager());
  }
  findById(id: string): Promise<(Product & AbstractEntity) | null> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<readonly (Product & AbstractEntity)[]> {
    throw new Error('Method not implemented.');
  }
  updateById(
    id: string,
    entity: Omit<Partial<Product>, keyof AbstractEntity>,
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  restoreById(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  private isBoolean(value: string): boolean {
    return value.toLowerCase() === '$eq:true';
  }

  async store(product: Product) {
    return await this.save(product);
  }

  async updateProduct(id: string, updateData: Partial<Product>) {
    const result = await this.update(id, updateData);
    if (result.affected === 0) {
      throw new ConflictException({
        message: 'No changes were made to the product.',
      });
    }
    if (result.affected !== 0 && result.raw.modifiedCount !== 0) {
      return 'success';
    }
  }

  async activate(id: string, newStatus: boolean) {
    return this.update(id, {
      status: newStatus,
    });
  }

  async getById(id: string) {
    return await this.findOne({
      where: {
        id,
      },
      relations:{
        category: true,
        brand: true,
      },
    });
  }
}
