import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redocExpressMiddleware from 'redoc-express';

export function setUpSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Inventario TS V1')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-session-id',
        in: 'header',
      },
      'session-id',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  app.use(
    '/redoc',
    redocExpressMiddleware({
      specUrl: '/doc-json',
      title: 'Sistema Inventario V1',
    }),
  );
}
