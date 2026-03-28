import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { LabServiceModule } from './lab-service.module';

async function bootstrap() {
  const app = await NestFactory.create(LabServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.LAB_SERVICE_PORT ?? 3008;
  await app.listen(port);
  console.log(`lab-service running on port ${port}`);
}
bootstrap();
