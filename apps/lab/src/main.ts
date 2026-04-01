import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import type { RequestHandler } from 'express';
import { LabServiceModule } from './lab-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LabServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Lab Service')
    .setDescription('Lab management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const docsHandler = (
    apiReference as unknown as (o: { content: unknown }) => RequestHandler
  )({ content: document });
  app.use('/api-docs', docsHandler);

  const port = process.env.LAB_SERVICE_PORT ?? 3008;
  await app.listen(port);
  console.log(
    `lab-service → http://localhost:${port} | docs: http://localhost:${port}/api-docs`,
  );
}
void bootstrap();
