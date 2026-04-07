import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { RequestHandler } from 'express';
import { AdminServiceModule } from './admin-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminServiceModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Admin Service')
    .setDescription('Super admin API — hospital management and system setup')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const docsHandler = (
    apiReference as unknown as (o: { content: unknown }) => RequestHandler
  )({ content: document });
  app.use('/api-docs', docsHandler);

  const port = process.env.ADMIN_SERVICE_PORT ?? 3009;
  await app.listen(port);
  console.log(
    `Admin service → http://localhost:${port} | docs: http://localhost:${port}/api-docs`,
  );
}

void bootstrap();
