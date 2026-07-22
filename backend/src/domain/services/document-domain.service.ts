import { Document } from '@domain/entities/document.entity';
import { DocumentStatus } from '@shared/enums/document-status.enum';

export class DocumentDomainService {
  validateDocumentIntegrity(document: Document, computedHash: string): boolean {
    return document.hashDocument === computedHash;
  }

  canBeVerified(document: Document): boolean {
    return document.status === DocumentStatus.ACTIVE;
  }

  getDocumentSummary(document: Document): Record<string, unknown> {
    return {
      id: document.id,
      clientName: document.clientName,
      transactionDate: document.transactionDate,
      status: document.status,
      createdAt: document.createdAt,
    };
  }
}
