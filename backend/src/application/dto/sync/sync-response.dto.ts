import { ApiProperty } from '@nestjs/swagger';
import { DocumentResponseDto } from '@application/dto/document/document-response.dto';
import { RevokedDocumentResponseDto } from './revoked-document-response.dto';

export class SyncPullResponseDto {
  @ApiProperty({ description: 'Requested documents', type: [DocumentResponseDto] })
  documents: DocumentResponseDto[];

  @ApiProperty({ description: 'List of revoked document IDs' })
  revokedIds: string[];

  @ApiProperty({ description: 'Revoked documents details', type: [RevokedDocumentResponseDto] })
  revokedDocuments: RevokedDocumentResponseDto[];
}

export class SyncRevokedResponseDto {
  @ApiProperty({ description: 'Revoked documents', type: [RevokedDocumentResponseDto] })
  revokedDocuments: RevokedDocumentResponseDto[];
}
