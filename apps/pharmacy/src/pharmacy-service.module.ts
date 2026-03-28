import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'shared/database/src';
import { SupabaseAuthModule } from 'shared/supabase-auth/src';
import { QueueModule } from 'shared/queue/src';
import { PharmacyServiceController } from './pharmacy-service.controller';
import { PharmacyServiceService } from './pharmacy-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
  ],
  controllers: [PharmacyServiceController],
  providers: [PharmacyServiceService],
})
export class PharmacyServiceModule {}
