import { ApiProperty } from '@nestjs/swagger';
import { VerificationResponseDto } from './verification-response.dto';

export class VerificationListResponseDto {
  @ApiProperty({ description: 'Total number of verifications' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;

  @ApiProperty({ description: 'List of verifications', type: [VerificationResponseDto] })
  items: VerificationResponseDto[];
}
