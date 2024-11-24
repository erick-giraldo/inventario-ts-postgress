import { Module } from '@nestjs/common';
import { MovementController } from './movement.controller';
import { MovementService } from './movement.service';
import { MovementRepository } from './movement.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movement } from './movement.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { ProductModule } from '../product/product.module';
import { BrandModule } from '../brand/brand.module';
import { CategoryModule } from '../category/category.module';
import { ClientModule } from '../client/client.module';
import { SupplierModule } from '../supplier/supplier.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Movement], MONGODB_CONNEXION_NAME),
    ProductModule,
    BrandModule,
    CategoryModule,
    ClientModule,
    SupplierModule
  ],
  controllers: [MovementController],
  providers: [MovementService, MovementRepository],
  exports: [MovementRepository]
})
export class MovementModule {}
