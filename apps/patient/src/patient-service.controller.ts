import { Controller, Get } from '@nestjs/common';
import { PatientServiceService } from './patient-service.service';

@Controller()
export class PatientServiceController {
  constructor(private readonly patientServiceService: PatientServiceService) {}

  @Get()
  getHello(): string {
    return this.patientServiceService.getHello();
  }
}
