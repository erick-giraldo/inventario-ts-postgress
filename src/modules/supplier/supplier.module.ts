import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './supplier.entity';
import { SupplierRepository } from './supplier.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier]), ConfigModule],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository],
  exports: [SupplierRepository]
})
export class SupplierModule {}
