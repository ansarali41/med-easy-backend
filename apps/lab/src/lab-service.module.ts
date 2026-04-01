import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { CoreModule } from '@app/common';
import { LabServiceController } from './lab-service.controller';
import { LabServiceService } from './lab-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    CoreModule,
  ],
  controllers: [LabServiceController],
  providers: [LabServiceService],
})
export class LabServiceModule {}
