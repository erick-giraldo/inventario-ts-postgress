import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import redocExpressMiddleware from 'redoc-express';

export function setUpSwagger(app: INestApplication) {
  SwaggerModule.setup('doc', app, () => {
    const config = new DocumentBuilder()
      .setTitle('Inventario TS V1')
      .addApiKey({
        type: 'apiKey',
        name: 'x-session-id',
        in: 'header'
      }, 'session-id')
      .build()

    return SwaggerModule.createDocument(app, config)
  })

  app.use('/redoc', redocExpressMiddleware({
    specUrl: 'doc-json',
    title: 'Sistema Inventario V1'
  }))
}