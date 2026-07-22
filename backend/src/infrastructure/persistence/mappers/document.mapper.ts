import { Document as PrismaDocument } from '@prisma-generated/client';
import { Document } from '@domain/entities/document.entity';
import { DocumentStatus } from '@shared/enums/document-status.enum';

export class DocumentMapper {
  static toDomain(entity: PrismaDocument): Document {
    return new Document(
      entity.id,
      entity.clientName,
      entity.transactionDate,
      entity.campaign,
      entity.location,
      entity.formData as Record<string, unknown>,
      entity.hashDocument,
      entity.signature,
      entity.status as DocumentStatus,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static toPersistence(domain: Document): Record<string, unknown> {
    return {
      id: domain.id,
      clientName: domain.clientName,
      transactionDate: domain.transactionDate,
      campaign: domain.campaign,
      location: domain.location,
      formData: domain.formData,
      hashDocument: domain.hashDocument,
      signature: domain.signature,
      status: domain.status,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    };
  }
}
