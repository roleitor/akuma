import { Injectable, Inject } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { RevokedDocumentRepository } from '@domain/ports/repositories/revoked-document-repository.interface';
import { RevokedDocument } from '@domain/entities/revoked-document.entity';
import { RevokeDocumentDto } from '@application/dto/document/revoke-document.dto';
import { AppError } from '@shared/errors/app-error';
import { ErrorCodes } from '@shared/errors/error-codes';

@Injectable()
export class RevokeDocumentUseCase {
  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
    @Inject('RevokedDocumentRepository')
    private readonly revokedDocumentRepository: RevokedDocumentRepository,
  ) {}

  async execute(id: string, dto: RevokeDocumentDto): Promise<void> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError(
        ErrorCodes.DOCUMENT_NOT_FOUND.code,
        ErrorCodes.DOCUMENT_NOT_FOUND.message,
        ErrorCodes.DOCUMENT_NOT_FOUND.statusCode,
      );
    }

    document.revoke();
    await this.documentRepository.update(document);

    const revokedDocument = RevokedDocument.create(id, dto.reason, dto.revokedBy);
    await this.revokedDocumentRepository.save(revokedDocument);
  }
}
