import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { PrescriptionServiceModule } from './prescription-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PrescriptionServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Prescription Service')
    .setDescription('Prescription management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ content: document }));

  const port = process.env.PRESCRIPTION_SERVICE_PORT ?? 3004;
  await app.listen(port);
  console.log(`prescription-service running on port ${port}`);
  console.log(`API docs: http://localhost:${port}/docs`);
}
bootstrap();
