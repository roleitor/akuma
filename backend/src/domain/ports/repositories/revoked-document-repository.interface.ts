import { RevokedDocument } from '@domain/entities/revoked-document.entity';

export interface RevokedDocumentRepository {
  findByDocumentId(documentId: string): Promise<RevokedDocument | null>;
  findAll(): Promise<RevokedDocument[]>;
  findByIds(ids: string[]): Promise<RevokedDocument[]>;
  save(revokedDocument: RevokedDocument): Promise<RevokedDocument>;
  delete(documentId: string): Promise<void>;
  exists(documentId: string): Promise<boolean>;
}
