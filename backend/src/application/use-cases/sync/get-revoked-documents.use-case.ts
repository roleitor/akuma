import { Injectable, Inject } from '@nestjs/common';
import { RevokedDocumentRepository } from '@domain/ports/repositories/revoked-document-repository.interface';
import { SyncRevokedResponseDto } from '@application/dto/sync/sync-response.dto';

@Injectable()
export class GetRevokedDocumentsUseCase {
  constructor(
    @Inject('RevokedDocumentRepository')
    private readonly revokedDocumentRepository: RevokedDocumentRepository,
  ) {}

  async execute(): Promise<SyncRevokedResponseDto> {
    const revokedDocuments = await this.revokedDocumentRepository.findAll();

    return {
      revokedDocuments: revokedDocuments.map((r) => ({
        documentId: r.documentId,
        reason: r.reason ?? undefined,
        revokedBy: r.revokedBy ?? undefined,
        revokedAt: r.revokedAt,
      })),
    };
  }
}
