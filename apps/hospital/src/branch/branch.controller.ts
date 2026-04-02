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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponse } from '@app/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@ApiTags('branches')
@Controller('hospitals/:hospitalId/branches')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @Get()
  @ApiOperation({ summary: 'List all branches for a hospital' })
  async findAll(@Param('hospitalId') hospitalId: string) {
    const data = await this.branchService.findAll(hospitalId);
    return ApiResponse.ok(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single branch' })
  async findOne(@Param('hospitalId') hospitalId: string, @Param('id') id: string) {
    const data = await this.branchService.findOne(hospitalId, id);
    return ApiResponse.ok(data);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new branch' })
  async create(
    @Param('hospitalId') hospitalId: string,
    @Body() dto: CreateBranchDto,
  ) {
    const data = await this.branchService.create(hospitalId, dto);
    return ApiResponse.ok(data, 'Branch created successfully.');
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a branch' })
  async update(
    @Param('hospitalId') hospitalId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBranchDto,
  ) {
    const data = await this.branchService.update(hospitalId, id, dto);
    return ApiResponse.ok(data, 'Branch updated successfully.');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a branch' })
  async remove(@Param('hospitalId') hospitalId: string, @Param('id') id: string) {
    await this.branchService.remove(hospitalId, id);
    return ApiResponse.ok(null, 'Branch deleted successfully.');
  }
}
