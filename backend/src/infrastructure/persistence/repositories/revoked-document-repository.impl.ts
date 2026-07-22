import { Injectable } from '@nestjs/common';
import { RevokedDocumentRepository } from '@domain/ports/repositories/revoked-document-repository.interface';
import { RevokedDocument } from '@domain/entities/revoked-document.entity';
import { RevokedDocumentMapper } from '@infrastructure/persistence/mappers/revoked-document.mapper';
import { PrismaService } from '@infrastructure/persistence/prisma/prisma.service';

@Injectable()
export class RevokedDocumentRepositoryImpl implements RevokedDocumentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDocumentId(documentId: string): Promise<RevokedDocument | null> {
    const entity = await this.prisma.revokedDocument.findUnique({ where: { documentId } });
    return entity ? RevokedDocumentMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<RevokedDocument[]> {
    const entities = await this.prisma.revokedDocument.findMany({
      orderBy: { revokedAt: 'desc' },
    });
    return entities.map(RevokedDocumentMapper.toDomain);
  }

  async findByIds(ids: string[]): Promise<RevokedDocument[]> {
    const entities = await this.prisma.revokedDocument.findMany({
      where: { documentId: { in: ids } },
    });
    return entities.map(RevokedDocumentMapper.toDomain);
  }

  async save(revokedDocument: RevokedDocument): Promise<RevokedDocument> {
    const data = RevokedDocumentMapper.toPersistence(revokedDocument);
    const saved = await this.prisma.revokedDocument.create({ data });
    return RevokedDocumentMapper.toDomain(saved);
  }

  async delete(documentId: string): Promise<void> {
    await this.prisma.revokedDocument.delete({ where: { documentId } });
  }

  async exists(documentId: string): Promise<boolean> {
    const count = await this.prisma.revokedDocument.count({ where: { documentId } });
    return count > 0;
  }
}
