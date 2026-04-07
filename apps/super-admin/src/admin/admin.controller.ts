import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse, PageResponseDto, PaginationDto } from '@app/common';
import {
  Public,
  Roles,
  RolesGuard,
  SupabaseAuthGuard,
} from '@app/supabase-auth';
import { AdminService } from './admin.service';
import {
  CreateHospitalDto,
  FindHospitalsFilterDto,
  SetupSuperAdminDto,
  UpdateHospitalDto,
  UpdateHospitalStatusDto,
} from './dto/admin.dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('setup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'One-time super admin bootstrap (requires setup key)',
  })
  async setup(@Body() dto: SetupSuperAdminDto) {
    const result = await this.adminService.setupSuperAdmin(dto);
    return ApiResponse.ok(result, result.message);
  }

  @Post('hospitals')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new hospital with admin account' })
  async createHospital(@Body() dto: CreateHospitalDto) {
    const result = await this.adminService.createHospital(dto);
    return ApiResponse.ok(result, 'Hospital created successfully.');
  }

  @Get('hospitals')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiOperation({ summary: 'List hospitals — page=-1 returns all' })
  async findAllHospitals(
    @Query() filterDto: FindHospitalsFilterDto,
    @Query() pagination: PaginationDto,
  ) {
    const [data, total] = await this.adminService.findAllHospitals(
      filterDto,
      pagination,
    );
    const counts = await this.adminService.getStatusCounts();
    const page = new PageResponseDto(
      pagination.page,
      pagination.limit,
      total,
      data,
    );
    return ApiResponse.ok({ ...page, ...counts });
  }

  @Patch('hospitals/:id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiOperation({ summary: 'Update hospital details' })
  async updateHospital(
    @Param('id') id: string,
    @Body() dto: UpdateHospitalDto,
  ) {
    const data = await this.adminService.updateHospital(id, dto);
    return ApiResponse.ok(data, 'Hospital updated successfully.');
  }

  @Patch('hospitals/:id/status')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('super_admin')
  @ApiOperation({ summary: 'Set hospital status: 1=active, 0=inactive' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateHospitalStatusDto,
  ) {
    const data = await this.adminService.updateHospitalStatus(id, dto.status);
    const label = dto.status === 1 ? 'activated' : 'deactivated';
    return ApiResponse.ok(data, `Hospital ${label} successfully.`);
  }
}
