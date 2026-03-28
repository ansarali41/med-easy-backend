import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { PatientServiceModule } from './patient-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PatientServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');
  const port = process.env.PATIENT_SERVICE_PORT ?? 3003;
  await app.listen(port);
  console.log(`patient-service running on port ${port}`);
}
bootstrap();
