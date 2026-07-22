import { Injectable, Inject } from '@nestjs/common';
import { VerificationRepository, VerificationFilters } from '@domain/ports/repositories/verification-repository.interface';
import { Verification } from '@domain/entities/verification.entity';
import { VerificationListResponseDto } from '@application/dto/verification/verification-list-response.dto';
import { VerificationResponseDto } from '@application/dto/verification/verification-response.dto';
import { PaginationUtil } from '@shared/utils/pagination.util';

export interface ListVerificationsQuery {
  documentId?: string;
  technicianId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class ListVerificationsUseCase {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(query: ListVerificationsQuery): Promise<VerificationListResponseDto> {
    const { page, limit } = PaginationUtil.normalizeParams(query.page, query.limit);

    const filters: VerificationFilters = {};
    if (query.documentId) filters.documentId = query.documentId;
    if (query.technicianId) filters.technicianId = query.technicianId;
    if (query.startDate) filters.startDate = new Date(query.startDate);
    if (query.endDate) filters.endDate = new Date(query.endDate);

    const result = await this.verificationRepository.findAll(filters, { page, limit });

    return {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      items: result.items.map((v) => this.toResponseDto(v)),
    };
  }

  private toResponseDto(verification: Verification): VerificationResponseDto {
    return {
      id: verification.id,
      documentId: verification.documentId,
      technicianId: verification.technicianId,
      technicianName: verification.technicianName,
      deviceId: verification.deviceId ?? undefined,
      verificationDate: verification.verificationDate,
      latitude: verification.latitude ?? undefined,
      longitude: verification.longitude ?? undefined,
      result: verification.result,
      synced: verification.synced,
      createdAt: verification.createdAt,
    };
  }
}
