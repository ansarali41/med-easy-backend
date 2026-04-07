import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateHospitalRoleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Permission map: { resource: { action: boolean } }',
    example: {
      branches: { view: true, manage: false },
      patients: { view: true, create: true, edit: false },
      staff: { view: true, create: false },
      appointments: { view: true, create: true },
      billing: { view: false, create: false },
    },
  })
  @IsObject()
  permissions: Record<string, Record<string, boolean>>;
}

export class UpdateHospitalRoleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  permissions?: Record<string, Record<string, boolean>>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateStaffDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ description: 'ID of the hospital role to assign' })
  @IsString()
  @IsNotEmpty()
  hospitalRoleId: string;

  @ApiPropertyOptional({ default: true, description: 'Whether this user can log in. Requires email + password when true.' })
  @IsOptional()
  @IsBoolean()
  canLogin?: boolean;
}

export class CreatePatientDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ description: 'Optional hospital role ID (e.g. Patient role)' })
  @IsOptional()
  @IsString()
  hospitalRoleId?: string;

  @ApiPropertyOptional({ default: true, description: 'Whether this user can log in. Requires email + password when true.' })
  @IsOptional()
  @IsBoolean()
  canLogin?: boolean;
}

export class ToggleLoginDto {
  @ApiProperty({ description: 'true = enable login, false = disable login' })
  @IsBoolean()
  canLogin: boolean;

  @ApiPropertyOptional({ minLength: 8, description: 'Required when enabling login' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiPropertyOptional({ description: 'Required when enabling login for a user without an email' })
  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateBranchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

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
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isMainBranch?: boolean;
}

export class UpdateBranchDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

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
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMainBranch?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
