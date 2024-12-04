import { Module } from '@nestjs/common';
import { SupplierController } from './supplier.controller';
import { SupplierService } from './supplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { Supplier } from './supplier.entity';
import { SupplierRepository } from './supplier.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier], MONGODB_CONNEXION_NAME)],
  controllers: [SupplierController],
  providers: [SupplierService, SupplierRepository],
  exports: [SupplierRepository]
})
export class SupplierModule {}
