import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { KardexModule } from './modules/kardex/kardex.module';
import { MONGODB_CONNEXION_NAME } from './utils/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/config/environment-variables';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleModule } from './modules/role/role.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { mapValidationError } from './utils/map-validation-error';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MovementModule } from './modules/movement/movement.module';
import { SupplierModule } from './modules/supplier/supplier.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    CategoryModule,
    BrandModule,
    UserModule,
    ProfileModule,
    RoleModule,
    AuthenticationModule,
    MovementModule,
    SupplierModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        exceptionFactory: (it) => {
          return new UnprocessableEntityException({
            message: 'Validation failed',
            data: it.map(mapValidationError),
          });
        },
        transform: true,
        whitelist: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
