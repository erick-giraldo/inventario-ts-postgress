// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { KardexModule } from './modules/kardex/kardex.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/inventario',
      database: 'inventario',
      useUnifiedTopology: true,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ProductModule,
    KardexModule,
  ],
})
export class AppModule {}
