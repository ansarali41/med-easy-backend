import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

// ─── Hospital filter (status only — pagination is a separate concern) ─────────

export class FindHospitalsFilterDto {
  @ApiPropertyOptional({ description: '1=active, 0=inactive', enum: [0, 1] })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsIn([0, 1])
  status?: 0 | 1;
}

// ─── Status update ────────────────────────────────────────────────────────────

export class UpdateHospitalStatusDto {
  @ApiProperty({ description: '1=active, 0=inactive', enum: [0, 1] })
  @IsInt()
  @IsIn([0, 1])
  status: 0 | 1;
}

// ─── Hospital info ────────────────────────────────────────────────────────────

export class HospitalInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;
}

// ─── Create / Update hospital ─────────────────────────────────────────────────

export class CreateHospitalDto {
  @ApiProperty({ type: HospitalInfoDto })
  @ValidateNested()
  @Type(() => HospitalInfoDto)
  hospital: HospitalInfoDto;

  @ApiProperty()
  @IsEmail()
  adminEmail: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  adminPassword: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminFirstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  adminLastName: string;
}

export class UpdateHospitalDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;
}

// ─── Super admin bootstrap ────────────────────────────────────────────────────

export class SetupSuperAdminDto {
  @ApiProperty({ description: 'Secret setup key from environment' })
  @IsString()
  @IsNotEmpty()
  setupKey: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;
}
