import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch, Hospital, HospitalRole, User, UserBranch } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { HospitalAdminController } from './hospital-admin.controller';
import { HospitalAdminService } from './hospital-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Hospital, HospitalRole, User, UserBranch]),
    SupabaseAuthModule,
  ],
  controllers: [HospitalAdminController],
  providers: [HospitalAdminService],
})
export class HospitalAdminModule {}
