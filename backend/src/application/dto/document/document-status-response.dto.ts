import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DocumentStatusResponseDto {
  @ApiProperty({ description: 'Document ID', example: 'DOC-A1B2C3D4' })
  id: string;

  @ApiProperty({ description: 'Document status', example: 'active', enum: ['active', 'revoked'] })
  status: string;

  @ApiProperty({ description: 'Whether the document is revoked' })
  revoked: boolean;

  @ApiPropertyOptional({ description: 'Reason for revocation' })
  reason?: string;

  @ApiPropertyOptional({ description: 'Revocation date' })
  revokedAt?: Date;

  @ApiPropertyOptional({ description: 'Last verification result' })
  lastVerification?: string;
}
