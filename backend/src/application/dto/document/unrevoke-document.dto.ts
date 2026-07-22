import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UnrevokeDocumentDto {
  @ApiPropertyOptional({ description: 'Reason for unrevocation' })
  @IsString()
  @IsOptional()
  reason?: string;
}
