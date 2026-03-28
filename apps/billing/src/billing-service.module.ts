import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'shared/database/src';
import { SupabaseAuthModule } from 'shared/supabase-auth/src';
import { BillingServiceController } from './billing-service.controller';
import { BillingServiceService } from './billing-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [BillingServiceController],
  providers: [BillingServiceService],
})
export class BillingServiceModule {}
