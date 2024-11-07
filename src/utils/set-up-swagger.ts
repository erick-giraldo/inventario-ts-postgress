import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redocExpressMiddleware from 'redoc-express';

export function setUpSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Inventario TS V1')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT', // Este es el key que usarás en @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI
  SwaggerModule.setup('doc', app, document);

  // Setup Redoc
  app.use(
    '/redoc',
    redocExpressMiddleware({
      specUrl: '/doc-json',
      title: 'Sistema Inventario V1',
    }),
  );
}