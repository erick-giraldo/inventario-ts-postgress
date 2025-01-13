import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoryModule } from '../category/category.module';
import { BrandModule } from '../brand/brand.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { StorageModule } from '../storage/storage.module';
import { ConfigModule } from '@nestjs/config';
import { SessionModule } from '../session/session.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    BrandModule,
    NestjsFormDataModule,
    StorageModule,
    ConfigModule,
    SessionModule
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
  exports: [ProductRepository, ProductService],
})
export class ProductModule {}
