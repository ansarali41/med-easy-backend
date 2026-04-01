import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { CoreModule } from '@app/common';
import { BillingServiceController } from './billing-service.controller';
import { BillingServiceService } from './billing-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    CoreModule,
  ],
  controllers: [BillingServiceController],
  providers: [BillingServiceService],
})
export class BillingServiceModule {}
