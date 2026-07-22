import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class VerificationResponseDto {
  @ApiProperty({ description: 'Verification ID' })
  id: string;

  @ApiProperty({ description: 'Document ID' })
  documentId: string;

  @ApiProperty({ description: 'Technician ID' })
  technicianId: string;

  @ApiProperty({ description: 'Technician name' })
  technicianName: string;

  @ApiPropertyOptional({ description: 'Device identifier' })
  deviceId?: string;

  @ApiProperty({ description: 'Verification date' })
  verificationDate: Date;

  @ApiPropertyOptional({ description: 'Latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  longitude?: number;

  @ApiProperty({ description: 'Verification result', enum: ['VALID', 'INVALID', 'REVOKED'] })
  result: string;

  @ApiProperty({ description: 'Sync status' })
  synced: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}
