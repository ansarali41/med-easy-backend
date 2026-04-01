import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { QueueModule } from '@app/queue';
import { CacheModule } from '@app/cache';
import { CoreModule } from '@app/common';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
    CacheModule,
    CoreModule,
  ],
  controllers: [AppointmentServiceController],
  providers: [AppointmentServiceService],
})
export class AppointmentServiceModule {}
