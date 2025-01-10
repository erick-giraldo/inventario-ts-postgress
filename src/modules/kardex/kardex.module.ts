import { Module } from '@nestjs/common';
import { KardexController } from './kardex.controller';
import { KardexService } from './kardex.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kardex } from './kardex.entity';
import { ProductModule } from '../product/product.module';
import { MovementModule } from '../movement/movement.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Kardex]),
    ProductModule,
    MovementModule,
    ConfigModule
  ],
  controllers: [KardexController],
  providers: [KardexService],
})
export class KardexModule {}
