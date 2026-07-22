import { Injectable, Inject } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { RevokedDocumentRepository } from '@domain/ports/repositories/revoked-document-repository.interface';
import { VerificationRepository } from '@domain/ports/repositories/verification-repository.interface';
import { DocumentStatusResponseDto } from '@application/dto/document/document-status-response.dto';
import { DocumentStatus } from '@shared/enums/document-status.enum';
import { AppError } from '@shared/errors/app-error';
import { ErrorCodes } from '@shared/errors/error-codes';

@Injectable()
export class GetDocumentStatusUseCase {
  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
    @Inject('RevokedDocumentRepository')
    private readonly revokedDocumentRepository: RevokedDocumentRepository,
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(id: string): Promise<DocumentStatusResponseDto> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError(
        ErrorCodes.DOCUMENT_NOT_FOUND.code,
        ErrorCodes.DOCUMENT_NOT_FOUND.message,
        ErrorCodes.DOCUMENT_NOT_FOUND.statusCode,
      );
    }

    const isRevoked = document.status === DocumentStatus.REVOKED;
    let reason: string | undefined;
    let revokedAt: Date | undefined;

    if (isRevoked) {
      const revokedDoc = await this.revokedDocumentRepository.findByDocumentId(id);
      if (revokedDoc) {
        reason = revokedDoc.reason ?? undefined;
        revokedAt = revokedDoc.revokedAt;
      }
    }

    const verifications = await this.verificationRepository.findByDocumentId(id);
    const lastVerification = verifications.length > 0
      ? verifications[verifications.length - 1].result
      : undefined;

    return {
      id: document.id,
      status: document.status,
      revoked: isRevoked,
      reason,
      revokedAt,
      lastVerification,
    };
  }
}
