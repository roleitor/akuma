import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RevokedDocumentResponseDto {
  @ApiProperty({ description: 'Document ID', example: 'DOC-A1B2C3D4' })
  documentId: string;

  @ApiPropertyOptional({ description: 'Revocation reason' })
  reason?: string;

  @ApiPropertyOptional({ description: 'Who revoked the document' })
  revokedBy?: string;

  @ApiProperty({ description: 'Revocation date' })
  revokedAt: Date;
}
