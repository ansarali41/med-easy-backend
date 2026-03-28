import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HospitalServiceModule } from './hospital-service.module';

async function bootstrap() {
  const app = await NestFactory.create(HospitalServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.HOSPITAL_SERVICE_PORT ?? 3001;
  await app.listen(port);
  console.log(`hospital-service running on port ${port}`);
}
bootstrap();
