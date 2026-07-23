import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PullDocumentsDto {
  @ApiPropertyOptional({ description: 'ISO timestamp para sincronización incremental', example: '2024-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  last_sync?: string;
}