import { Document } from '@domain/entities/document.entity';
import { PaginationParams, PaginatedResult } from '@shared/utils/pagination.util';

export interface DocumentRepository {
  findById(id: string): Promise<Document | null>;
  findByIds(ids: string[]): Promise<Document[]>;
  findAll(pagination: PaginationParams): Promise<PaginatedResult<Document>>;
  save(document: Document): Promise<Document>;
  update(document: Document): Promise<Document>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  existsById(id: string): Promise<boolean>;
}
