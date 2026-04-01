import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';
import { CoreModule } from '@app/common';
import { HospitalServiceController } from './hospital-service.controller';
import { HospitalServiceService } from './hospital-service.service';
import { OnboardModule } from './onboard/onboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CoreModule,
    OnboardModule,
  ],
  controllers: [HospitalServiceController],
  providers: [HospitalServiceService],
})
export class HospitalServiceModule {}
