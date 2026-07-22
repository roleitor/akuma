import { Injectable, Inject } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { Document } from '@domain/entities/document.entity';
import { AppError } from '@shared/errors/app-error';
import { ErrorCodes } from '@shared/errors/error-codes';

@Injectable()
export class GetDocumentUseCase {
  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
  ) {}

  async execute(id: string): Promise<Document> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError(
        ErrorCodes.DOCUMENT_NOT_FOUND.code,
        ErrorCodes.DOCUMENT_NOT_FOUND.message,
        ErrorCodes.DOCUMENT_NOT_FOUND.statusCode,
      );
    }
    return document;
  }
}
