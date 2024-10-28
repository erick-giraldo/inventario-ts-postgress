// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './producto/producto.module';
import { KardexModule } from './kardex/kardex.module';

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
    ProductoModule,
    KardexModule,
  ],
})
export class AppModule {}
