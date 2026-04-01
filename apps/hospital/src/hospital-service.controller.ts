import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HospitalServiceService } from './hospital-service.service';

@ApiTags('health')
@Controller()
export class HospitalServiceController {
  constructor(
    private readonly hospitalServiceService: HospitalServiceService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  getHello(): string {
    return this.hospitalServiceService.getHello();
  }
}
