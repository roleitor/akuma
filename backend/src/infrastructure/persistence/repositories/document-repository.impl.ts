import { Injectable } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { Document } from '@domain/entities/document.entity';
import { DocumentMapper } from '@infrastructure/persistence/mappers/document.mapper';
import { PaginationParams, PaginatedResult, PaginationUtil } from '@shared/utils/pagination.util';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';
import { Prisma } from '@prisma-generated/client';

@Injectable()
export class DocumentRepositoryImpl implements DocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Document | null> {
    const entity = await this.prisma.document.findUnique({ where: { id } });
    return entity ? DocumentMapper.toDomain(entity) : null;
  }

  async findByIds(ids: string[]): Promise<Document[]> {
    const entities = await this.prisma.document.findMany({
      where: { id: { in: ids } },
    });
    return entities.map(DocumentMapper.toDomain);
  }

  async findByUpdatedAtSince(since: Date): Promise<Document[]> {
    const entities = await this.prisma.document.findMany({
      where: { updatedAt: { gte: since } },
      orderBy: { updatedAt: 'asc' },
    });
    return entities.map(DocumentMapper.toDomain);
  }

  async findAll(pagination: PaginationParams): Promise<PaginatedResult<Document>> {
    const skip = PaginationUtil.getSkip(pagination.page, pagination.limit);
    const [entities, total] = await Promise.all([
      this.prisma.document.findMany({
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.document.count(),
    ]);

    return PaginationUtil.toPaginatedResult(
      entities.map(DocumentMapper.toDomain),
      total,
      pagination.page,
      pagination.limit,
    );
  }

  async save(document: Document): Promise<Document> {
    const data = DocumentMapper.toPersistence(document) as Prisma.DocumentCreateInput;
    const saved = await this.prisma.document.create({ data });
    return DocumentMapper.toDomain(saved);
  }

  async update(document: Document): Promise<Document> {
    const data = DocumentMapper.toPersistence(document) as Prisma.DocumentUpdateInput;
    const saved = await this.prisma.document.update({
      where: { id: document.id },
      data,
    });
    return DocumentMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.document.count();
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.document.count({ where: { id } });
    return count > 0;
  }
}
