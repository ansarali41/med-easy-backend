import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class HospitalInfoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string;
}

export class OnboardHospitalDto {
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

export class OnboardResponseDto {
  @ApiProperty()
  hospitalId: string;

  @ApiProperty()
  slug: string;
}
