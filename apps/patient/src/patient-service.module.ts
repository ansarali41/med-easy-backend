import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { CoreModule } from '@app/common';
import { PatientServiceController } from './patient-service.controller';
import { PatientServiceService } from './patient-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    CoreModule,
  ],
  controllers: [PatientServiceController],
  providers: [PatientServiceService],
})
export class PatientServiceModule {}
