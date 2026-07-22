import { Verification } from '@domain/entities/verification.entity';
import { PaginationParams, PaginatedResult } from '@shared/utils/pagination.util';

export interface VerificationFilters {
  documentId?: string;
  technicianId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface VerificationRepository {
  findById(id: string): Promise<Verification | null>;
  findByDocumentId(documentId: string): Promise<Verification[]>;
  findAll(filters: VerificationFilters, pagination: PaginationParams): Promise<PaginatedResult<Verification>>;
  save(verification: Verification): Promise<Verification>;
  saveBatch(verifications: Verification[]): Promise<Verification[]>;
  count(filters?: VerificationFilters): Promise<number>;
}
