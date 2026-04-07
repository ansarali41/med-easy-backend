import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@app/common';
import { Roles, RolesGuard, SupabaseAuthGuard } from '@app/supabase-auth';
import { HospitalAdminService } from './hospital-admin.service';
import {
  CreateBranchDto,
  CreateHospitalRoleDto,
  CreatePatientDto,
  CreateStaffDto,
  ToggleLoginDto,
  UpdateBranchDto,
  UpdateHospitalRoleDto,
} from './dto/hospital-admin.dto';

@ApiTags('hospital-admin')
@Controller('hospital-admin')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('hospital_admin')
export class HospitalAdminController {
  constructor(private readonly service: HospitalAdminService) {}

  private getHospitalId(req: any): string {
    return req.user?.user_metadata?.tenant_id as string;
  }

  // ─── Branches ─────────────────────────────────────────────────────────────

  @Get('branches')
  @ApiOperation({ summary: 'List all branches for the caller hospital' })
  async getBranches(@Request() req: any) {
    const data = await this.service.getBranches(this.getHospitalId(req));
    return ApiResponse.ok(data);
  }

  @Post('branches')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch' })
  async createBranch(@Request() req: any, @Body() dto: CreateBranchDto) {
    const data = await this.service.createBranch(this.getHospitalId(req), dto);
    return ApiResponse.ok(data, 'Branch created successfully.');
  }

  @Patch('branches/:id')
  @ApiOperation({ summary: 'Update a branch' })
  async updateBranch(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateBranchDto) {
    const data = await this.service.updateBranch(this.getHospitalId(req), id, dto);
    return ApiResponse.ok(data, 'Branch updated successfully.');
  }

  @Delete('branches/:id')
  @ApiOperation({ summary: 'Delete a branch' })
  async deleteBranch(@Request() req: any, @Param('id') id: string) {
    await this.service.deleteBranch(this.getHospitalId(req), id);
    return ApiResponse.ok(null, 'Branch deleted successfully.');
  }

  // ─── Custom Roles ─────────────────────────────────────────────────────────

  @Get('roles')
  @ApiOperation({ summary: 'List all custom roles for the caller hospital' })
  async getRoles(@Request() req: any) {
    const data = await this.service.getRoles(this.getHospitalId(req));
    return ApiResponse.ok(data);
  }

  @Post('roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a custom role' })
  async createRole(@Request() req: any, @Body() dto: CreateHospitalRoleDto) {
    const data = await this.service.createRole(this.getHospitalId(req), dto);
    return ApiResponse.ok(data, 'Role created successfully.');
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Update a custom role' })
  async updateRole(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateHospitalRoleDto) {
    const data = await this.service.updateRole(this.getHospitalId(req), id, dto);
    return ApiResponse.ok(data, 'Role updated successfully.');
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Deactivate a custom role' })
  async deleteRole(@Request() req: any, @Param('id') id: string) {
    await this.service.deleteRole(this.getHospitalId(req), id);
    return ApiResponse.ok(null, 'Role deactivated successfully.');
  }

  // ─── Staff ────────────────────────────────────────────────────────────────

  @Get('branches/:branchId/staff')
  @ApiOperation({ summary: 'List staff in a branch' })
  async getStaff(@Request() req: any, @Param('branchId') branchId: string) {
    const data = await this.service.getStaff(this.getHospitalId(req), branchId);
    return ApiResponse.ok(data);
  }

  @Post('branches/:branchId/staff')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a staff account and assign to branch' })
  async createStaff(@Request() req: any, @Param('branchId') branchId: string, @Body() dto: CreateStaffDto) {
    const data = await this.service.createStaff(this.getHospitalId(req), branchId, dto);
    return ApiResponse.ok(data, 'Staff account created successfully.');
  }

  // ─── Patients ─────────────────────────────────────────────────────────────

  @Get('branches/:branchId/patients')
  @ApiOperation({ summary: 'List patients in a branch' })
  async getPatients(@Request() req: any, @Param('branchId') branchId: string) {
    const data = await this.service.getPatients(this.getHospitalId(req), branchId);
    return ApiResponse.ok(data);
  }

  @Post('branches/:branchId/patients')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a patient account and assign to branch' })
  async createPatient(@Request() req: any, @Param('branchId') branchId: string, @Body() dto: CreatePatientDto) {
    const data = await this.service.createPatient(this.getHospitalId(req), branchId, dto);
    return ApiResponse.ok(data, 'Patient account created successfully.');
  }

  // ─── Login Access ─────────────────────────────────────────────────────────

  @Patch('users/:userId/login-access')
  @ApiOperation({ summary: 'Enable or disable login access for a staff member or patient' })
  async toggleLoginAccess(@Request() req: any, @Param('userId') userId: string, @Body() dto: ToggleLoginDto) {
    const data = await this.service.toggleLoginAccess(this.getHospitalId(req), userId, dto);
    return ApiResponse.ok(data, dto.canLogin ? 'Login access enabled.' : 'Login access disabled.');
  }
}
