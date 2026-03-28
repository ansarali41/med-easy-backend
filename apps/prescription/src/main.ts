import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PrescriptionServiceModule } from './prescription-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PrescriptionServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.PRESCRIPTION_SERVICE_PORT ?? 3004;
  await app.listen(port);
  console.log(`prescription-service running on port ${port}`);
}
bootstrap();
