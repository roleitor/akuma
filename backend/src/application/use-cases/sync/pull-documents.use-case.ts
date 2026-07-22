import { Injectable, Inject } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { RevokedDocumentRepository } from '@domain/ports/repositories/revoked-document-repository.interface';
import { Document } from '@domain/entities/document.entity';
import { PullDocumentsDto } from '@application/dto/sync/pull-documents.dto';
import { SyncPullResponseDto } from '@application/dto/sync/sync-response.dto';
import { DocumentResponseDto } from '@application/dto/document/document-response.dto';

@Injectable()
export class PullDocumentsUseCase {
  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
    @Inject('RevokedDocumentRepository')
    private readonly revokedDocumentRepository: RevokedDocumentRepository,
  ) {}

  async execute(dto: PullDocumentsDto): Promise<SyncPullResponseDto> {
    const documents = await this.documentRepository.findByIds(dto.ids);
    const revokedDocuments = await this.revokedDocumentRepository.findAll();

    return {
      documents: documents.map((doc) => this.toDocumentResponseDto(doc)),
      revokedIds: revokedDocuments.map((r) => r.documentId),
      revokedDocuments: revokedDocuments.map((r) => ({
        documentId: r.documentId,
        reason: r.reason ?? undefined,
        revokedBy: r.revokedBy ?? undefined,
        revokedAt: r.revokedAt,
      })),
    };
  }

  private toDocumentResponseDto(document: Document): DocumentResponseDto {
    return {
      id: document.id,
      clientName: document.clientName,
      transactionDate: document.transactionDate,
      campaign: document.campaign ?? undefined,
      location: document.location ?? undefined,
      formData: document.formData,
      hashDocument: document.hashDocument,
      signature: document.signature,
      qrPayload: '',
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
