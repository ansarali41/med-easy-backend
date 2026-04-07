import { Module } from '@nestjs/common';
import { CommonModule } from '@app/common';
import { DatabaseModule } from '@app/database';
import { SupabaseAuthModule } from '@app/supabase-auth';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [DatabaseModule, CommonModule, SupabaseAuthModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
