import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { QueueModule } from '@app/queue';
import { CoreModule } from '@app/common';
import { PrescriptionServiceController } from './prescription-service.controller';
import { PrescriptionServiceService } from './prescription-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
    CoreModule,
  ],
  controllers: [PrescriptionServiceController],
  providers: [PrescriptionServiceService],
})
export class PrescriptionServiceModule {}
