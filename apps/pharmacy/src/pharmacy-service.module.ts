import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { QueueModule } from '@app/queue';
import { CoreModule } from '@app/common';
import { PharmacyServiceController } from './pharmacy-service.controller';
import { PharmacyServiceService } from './pharmacy-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    QueueModule,
    CoreModule,
  ],
  controllers: [PharmacyServiceController],
  providers: [PharmacyServiceService],
})
export class PharmacyServiceModule {}
