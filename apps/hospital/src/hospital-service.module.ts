import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule, Hospital, User } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { HospitalServiceController } from './hospital-service.controller';
import { HospitalServiceService } from './hospital-service.service';
import { OnboardController } from './onboard/onboard.controller';
import { OnboardService } from './onboard/onboard.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    SupabaseAuthModule,
    TypeOrmModule.forFeature([Hospital, User]),
  ],
  controllers: [HospitalServiceController, OnboardController],
  providers: [HospitalServiceService, OnboardService],
})
export class HospitalServiceModule {}
