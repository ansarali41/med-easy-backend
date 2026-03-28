import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { BillingServiceModule } from './billing-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.BILLING_SERVICE_PORT ?? 3006;
  await app.listen(port);
  console.log(`billing-service running on port ${port}`);
}
bootstrap();
