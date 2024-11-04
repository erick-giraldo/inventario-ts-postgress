import { Module, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
import { KardexModule } from './modules/kardex/kardex.module';
import { MONGODB_CONNEXION_NAME } from './utils/constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './common/config/environment-variables';
import { CategoryModule } from './modules/category/category.module';
import { BrandModule } from './modules/brand/brand.module';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { mapValidationError } from './utils/map-validation-error';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { ProfileModule } from './modules/profile/profile.module';
import { RoleService } from './modules/role/role.service';
import { RoleModule } from './modules/role/role.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';

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
    SessionModule,
    ProfileModule,
    RoleModule,
    AuthenticationModule,
  ],
  providers:[
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
    RoleService,
  ]
})
export class AppModule {}
