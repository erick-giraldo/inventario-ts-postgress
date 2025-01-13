import {
  Module,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './modules/product/product.module';
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
import { CustomerModule } from './modules/customer/customer.module';
import { ConfirmationCodeModule } from './modules/confirmation-code/confirmation-code.module';
import { StorageModule } from './modules/storage/storage.module';
import { validateConfig } from './utils/validate-config';
import { CustomNamingStrategy } from './utils/custom-naming.strategy';
import { Environment } from './common/enums/environment.enum';
import { EmailNotificationModule } from './modules/email-notification/email-notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateConfig,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService<EnvironmentVariables, true>,
      ) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          database: configService.get('POSTGRES_NAME'),
          username: configService.get('POSTGRES_USERNAME'),
          password: configService.get('POSTGRES_PASSWORD'),
          namingStrategy: new CustomNamingStrategy(),
          logging:
            configService.get('NODE_ENV') === Environment.PRODUCTION
              ? ['error']
              : 'all',
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    ProductModule,
    // KardexModule,
    CategoryModule,
    BrandModule,
    UserModule,
    ProfileModule,
    RoleModule,
    AuthenticationModule,
    MovementModule,
    SupplierModule,
    CustomerModule,
    ConfirmationCodeModule,
    EmailNotificationModule,
    StorageModule,
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
