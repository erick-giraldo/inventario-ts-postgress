import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { KardexModule } from './modules/kardex/kardex.module';
import { MONGODB_CONNEXION_NAME } from './utils/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/config/environment-variables';
import { Environment } from '@/common/enums/environment.enum';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Asegúrate de inicializar el módulo de configuración de forma global
    TypeOrmModule.forRootAsync({
      name: MONGODB_CONNEXION_NAME,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => ({
          type: 'mongodb',
          url: configService.get('MONGODB_HOST', { infer: true }),
          database: configService.get('MONGODB_NAME', { infer: true }),
          autoLoadEntities: true,
          synchronize: true,
          authSource: configService.get('MONGODB_AUTH_SOURCE', { infer: true }),
        }),
    }),
    ProductModule,
    KardexModule,
  ],
})
export class AppModule {}
