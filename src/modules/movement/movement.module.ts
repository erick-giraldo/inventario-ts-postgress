import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';
import { MovementRepository } from './movement.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { ProductModule } from '../product/product.module';
import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { CustomerModule } from '../customer/customer.module';
import { SupplierModule } from '../supplier/supplier.module';
import { SessionModule } from '../session/session.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movement]),
    ProductModule,
    BrandModule,
    CategoryModule,
    CustomerModule,
    SupplierModule,
    SessionModule
  ],
  controllers: [MovementController],
  providers: [MovementService, MovementRepository],
  exports: [MovementRepository]
})
export class MovementModule {}
