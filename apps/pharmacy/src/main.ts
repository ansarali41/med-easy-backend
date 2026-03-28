import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PharmacyServiceModule } from './pharmacy-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PharmacyServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.PHARMACY_SERVICE_PORT ?? 3005;
  await app.listen(port);
  console.log(`pharmacy-service running on port ${port}`);
}
bootstrap();
