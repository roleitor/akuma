import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class RevokeDocumentDto {
  @ApiPropertyOptional({ description: 'Reason for revocation', example: 'Documento emitido por error' })
  @IsString()
  @IsOptional()
  reason?: string;

  @ApiPropertyOptional({ description: 'User who revoked the document' })
  @IsString()
  @IsOptional()
  revokedBy?: string;
}
