import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'shared/database/src';
import { SupabaseAuthModule } from 'shared/supabase-auth/src';
import { QueueModule } from 'shared/queue/src';
import { CacheModule } from 'shared/cache/src';
import { AppointmentServiceController } from './appointment-service.controller';
import { AppointmentServiceService } from './appointment-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
    CacheModule,
  ],
  controllers: [AppointmentServiceController],
  providers: [AppointmentServiceService],
})
export class AppointmentServiceModule {}
