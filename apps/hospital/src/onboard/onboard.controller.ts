import { Body, Controller, Post } from '@nestjs/common';
import { OnboardService } from './onboard.service';
import { OnboardHospitalDto } from './onboard.dto';

@Controller('hospitals')
export class OnboardController {
  constructor(private readonly onboardService: OnboardService) {}

  @Post('onboard')
  onboard(@Body() dto: OnboardHospitalDto) {
    return this.onboardService.onboard(dto);
  }
}
