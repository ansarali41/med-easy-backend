import { Controller, Get } from '@nestjs/common';
import { LabServiceService } from './lab-service.service';

@Controller()
export class LabServiceController {
  constructor(private readonly labServiceService: LabServiceService) {}

  @Get()
  getHello(): string {
    return this.labServiceService.getHello();
  }
}
