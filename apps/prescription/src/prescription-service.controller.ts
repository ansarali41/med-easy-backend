import { Controller, Get } from '@nestjs/common';
import { PrescriptionServiceService } from './prescription-service.service';

@Controller()
export class PrescriptionServiceController {
  constructor(
    private readonly prescriptionServiceService: PrescriptionServiceService,
  ) {}

  @Get()
  getHello(): string {
    return this.prescriptionServiceService.getHello();
  }
}
