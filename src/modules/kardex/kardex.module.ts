import { Module } from '@nestjs/common';
import { KardexController } from './kardex.controller';
import { KardexService } from './kardex.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { Kardex } from './kardex.entity';
import { ProductModule } from '../product/product.module';
import { MovementModule } from '../movement/movement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kardex], MONGODB_CONNEXION_NAME),
    ProductModule,
    MovementModule
  ],
  controllers: [KardexController],
  providers: [KardexService],
})
export class KardexModule {}
