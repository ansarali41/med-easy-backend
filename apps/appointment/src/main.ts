import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppointmentServiceModule } from './appointment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AppointmentServiceModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Appointment Service')
    .setDescription('Appointment management API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs', apiReference({ content: document }));

  const port = process.env.APPOINTMENT_SERVICE_PORT ?? 3002;
  await app.listen(port);
  console.log(`appointment-service running on port ${port}`);
  console.log(`API docs: http://localhost:${port}/docs`);
}
bootstrap();
