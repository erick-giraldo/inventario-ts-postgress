import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { setUpSwagger } from './utils/set-up-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('bootstrap');

  app.enableCors({
    origin: configService.get('FRONTEND_HOST'),
    credentials: true,
  });

  if (configService.get('NODE_ENV') !== 'production') setUpSwagger(app);

  const port = configService.get('PORT');
  await app.listen(port);

  logger.log(`Inventario API running on port: ${port}`);
}

bootstrap();
