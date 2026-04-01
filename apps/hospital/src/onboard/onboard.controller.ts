import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@app/common';
import { OnboardService } from './onboard.service';
import { OnboardHospitalDto, OnboardResponseDto } from './dto/onboard.dto';

@ApiTags('hospitals')
@Controller('hospitals')
export class OnboardController {
  constructor(private readonly onboardService: OnboardService) {}

  @Post('onboard')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Onboard a new hospital with admin account' })
  @ApiCreatedResponse({ type: OnboardResponseDto })
  async onboard(
    @Body() dto: OnboardHospitalDto,
  ): Promise<ApiResponse<OnboardResponseDto>> {
    const result = await this.onboardService.onboard(dto);
    return ApiResponse.ok(result, 'Hospital registered successfully.');
  }
}
