import { RevokedDocument as PrismaRevokedDocument } from '@prisma-generated/client';
import { RevokedDocument } from '@domain/entities/revoked-document.entity';

export class RevokedDocumentMapper {
  static toDomain(entity: PrismaRevokedDocument): RevokedDocument {
    return new RevokedDocument(
      entity.documentId,
      entity.reason,
      entity.revokedBy,
      entity.revokedAt,
    );
  }

  static toPersistence(domain: RevokedDocument): {
    documentId: string;
    reason: string | null;
    revokedBy: string | null;
    revokedAt: Date;
  } {
    return {
      documentId: domain.documentId,
      reason: domain.reason,
      revokedBy: domain.revokedBy,
      revokedAt: domain.revokedAt,
    };
  }
}
