import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppointmentServiceModule } from './appointment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AppointmentServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.APPOINTMENT_SERVICE_PORT ?? 3002;
  await app.listen(port);
  console.log(`appointment-service running on port ${port}`);
}
bootstrap();
