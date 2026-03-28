import { Controller, Get } from '@nestjs/common';
import { PharmacyServiceService } from './pharmacy-service.service';

@Controller()
export class PharmacyServiceController {
  constructor(private readonly pharmacyServiceService: PharmacyServiceService) {}

  @Get()
  getHello(): string {
    return this.pharmacyServiceService.getHello();
  }
}
