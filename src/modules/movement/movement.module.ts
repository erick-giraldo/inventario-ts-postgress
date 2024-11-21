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


@Module({
  imports: [
    TypeOrmModule.forFeature([Movement], MONGODB_CONNEXION_NAME),
    ProductModule,
    BrandModule,
    CategoryModule
  ],
  controllers: [MovementController],
  providers: [MovementService, MovementRepository]
})
export class MovementModule {}
