import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentResponseDto {
  @ApiProperty({ description: 'Document ID', example: 'DOC-A1B2C3D4' })
  id: string;

  @ApiProperty({ description: 'Client name', example: 'Juan Pérez' })
  clientName: string;

  @ApiProperty({ description: 'Transaction date', example: '2024-01-15' })
  transactionDate: string;

  @ApiPropertyOptional({ description: 'Campaign name' })
  campaign?: string;

  @ApiPropertyOptional({ description: 'Location' })
  location?: string;

  @ApiProperty({ description: 'Form data' })
  formData: Record<string, unknown>;

  @ApiProperty({ description: 'Document hash (SHA-256)', example: 'a1b2c3d4...' })
  hashDocument: string;

  @ApiProperty({ description: 'ECDSA signature', example: 'MEUCIQD...' })
  signature: string;

  @ApiProperty({ description: 'QR Payload (Base64 encoded)', example: 'eyJ2IjoiMSIs...' })
  qrPayload: string;

  @ApiProperty({ description: 'Document status', example: 'active' })
  status: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}
