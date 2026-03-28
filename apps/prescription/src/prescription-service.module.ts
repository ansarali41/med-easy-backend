import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'shared/database/src';
import { SupabaseAuthModule } from 'shared/supabase-auth/src';
import { QueueModule } from 'shared/queue/src';
import { PrescriptionServiceController } from './prescription-service.controller';
import { PrescriptionServiceService } from './prescription-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
  ],
  controllers: [PrescriptionServiceController],
  providers: [PrescriptionServiceService],
})
export class PrescriptionServiceModule {}
