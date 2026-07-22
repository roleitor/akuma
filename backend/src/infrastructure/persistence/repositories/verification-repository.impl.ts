import { Injectable } from '@nestjs/common';
import { VerificationRepository, VerificationFilters } from '@domain/ports/repositories/verification-repository.interface';
import { Verification } from '@domain/entities/verification.entity';
import { VerificationMapper } from '@infrastructure/persistence/mappers/verification.mapper';
import { PaginationParams, PaginatedResult, PaginationUtil } from '@shared/utils/pagination.util';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { Prisma } from '@prisma-generated/client';

@Injectable()
export class VerificationRepositoryImpl implements VerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Verification | null> {
    const entity = await this.prisma.verification.findUnique({ where: { id } });
    return entity ? VerificationMapper.toDomain(entity) : null;
  }

  async findByDocumentId(documentId: string): Promise<Verification[]> {
    const entities = await this.prisma.verification.findMany({
      where: { documentId },
      orderBy: { verificationDate: 'asc' },
    });
    return entities.map(VerificationMapper.toDomain);
  }

  async findAll(filters: VerificationFilters, pagination: PaginationParams): Promise<PaginatedResult<Verification>> {
    const where: Prisma.VerificationWhereInput = {};

    if (filters.documentId) where.documentId = filters.documentId;
    if (filters.technicianId) where.technicianId = filters.technicianId;
    if (filters.startDate || filters.endDate) {
      where.verificationDate = {};
      if (filters.startDate) where.verificationDate.gte = filters.startDate;
      if (filters.endDate) where.verificationDate.lte = filters.endDate;
    }

    const skip = PaginationUtil.getSkip(pagination.page, pagination.limit);
    const [entities, total] = await Promise.all([
      this.prisma.verification.findMany({
        where,
        skip,
        take: pagination.limit,
        orderBy: { verificationDate: 'desc' },
      }),
      this.prisma.verification.count({ where }),
    ]);

    return PaginationUtil.toPaginatedResult(
      entities.map(VerificationMapper.toDomain),
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async save(verification: Verification): Promise<Verification> {
    const data = VerificationMapper.toPersistence(verification);
    const saved = await this.prisma.verification.create({ data });
    return VerificationMapper.toDomain(saved);
  }

  async saveBatch(verifications: Verification[]): Promise<Verification[]> {
    const data = verifications.map(VerificationMapper.toPersistence);
    const saved = await this.prisma.verification.createManyAndReturn({ data });
    return saved.map(VerificationMapper.toDomain);
  }

  async count(filters?: VerificationFilters): Promise<number> {
    if (!filters) return this.prisma.verification.count();

    const where: Prisma.VerificationWhereInput = {};
    if (filters.documentId) where.documentId = filters.documentId;
    if (filters.technicianId) where.technicianId = filters.technicianId;

    return this.prisma.verification.count({ where });
  }
}
