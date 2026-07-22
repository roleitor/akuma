import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class PullDocumentsDto {
  @ApiProperty({ description: 'List of document IDs to pull', example: ['DOC-A1B2C3D4', 'DOC-E5F6G7H8'] })
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
