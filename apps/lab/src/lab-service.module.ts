import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'shared/database/src';
import { SupabaseAuthModule } from 'shared/supabase-auth/src';
import { LabServiceController } from './lab-service.controller';
import { LabServiceService } from './lab-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
  ],
  controllers: [LabServiceController],
  providers: [LabServiceService],
})
export class LabServiceModule {}
