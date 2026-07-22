import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { VerificationResult } from '@shared/enums/verification-result.enum';

export class RegisterVerificationDto {
  @ApiProperty({ description: 'Document ID', example: 'DOC-A1B2C3D4' })
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @ApiProperty({ description: 'Technician ID', example: 'TECH-001' })
  @IsString()
  @IsNotEmpty()
  technicianId: string;

  @ApiProperty({ description: 'Technician name', example: 'Carlos López' })
  @IsString()
  @IsNotEmpty()
  technicianName: string;

  @ApiPropertyOptional({ description: 'Device identifier' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiProperty({ description: 'Verification date', example: '2024-01-15T10:30:00Z' })
  @IsDateString()
  @IsNotEmpty()
  verificationDate: string;

  @ApiPropertyOptional({ description: 'Latitude', example: -12.0464 })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude', example: -77.0428 })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({ description: 'Verification result', enum: VerificationResult, example: VerificationResult.VALID })
  @IsEnum(VerificationResult)
  @IsNotEmpty()
  result: VerificationResult;
}
