import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentTemplate, Hospital, User } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { OnboardController } from './onboard.controller';
import { OnboardService } from './onboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, User, DepartmentTemplate]), SupabaseAuthModule],
  controllers: [OnboardController],
  providers: [OnboardService],
})
export class OnboardModule {}
