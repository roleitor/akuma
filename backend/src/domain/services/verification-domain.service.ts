import { Verification } from '@domain/entities/verification.entity';
import { VerificationResult } from '@shared/enums/verification-result.enum';
import { DocumentStatus } from '@shared/enums/document-status.enum';

export class VerificationDomainService {
  determineDocumentResult(
    documentExists: boolean,
    documentStatus: DocumentStatus | null,
    hashValid: boolean,
    signatureValid: boolean,
  ): VerificationResult {
    if (!documentExists || !documentStatus) {
      return VerificationResult.INVALID;
    }

    if (documentStatus === DocumentStatus.REVOKED) {
      return VerificationResult.REVOKED;
    }

    if (!hashValid || !signatureValid) {
      return VerificationResult.INVALID;
    }

    return VerificationResult.VALID;
  }
}
