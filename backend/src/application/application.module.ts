import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@infrastructure/infrastructure.module';
import { CreateDocumentUseCase } from './use-cases/document/create-document.use-case';
import { GetDocumentUseCase } from './use-cases/document/get-document.use-case';
import { GetDocumentStatusUseCase } from './use-cases/document/get-document-status.use-case';
import { RevokeDocumentUseCase } from './use-cases/document/revoke-document.use-case';
import { UnrevokeDocumentUseCase } from './use-cases/document/unrevoke-document.use-case';
import { RegisterVerificationUseCase } from './use-cases/verification/register-verification.use-case';
import { BatchVerificationUseCase } from './use-cases/verification/batch-verification.use-case';
import { ListVerificationsUseCase } from './use-cases/verification/list-verifications.use-case';
import { PullDocumentsUseCase } from './use-cases/sync/pull-documents.use-case';
import { GetRevokedDocumentsUseCase } from './use-cases/sync/get-revoked-documents.use-case';

@Module({
  imports: [InfrastructureModule],
  providers: [
    CreateDocumentUseCase,
    GetDocumentUseCase,
    GetDocumentStatusUseCase,
    RevokeDocumentUseCase,
    UnrevokeDocumentUseCase,
    RegisterVerificationUseCase,
    BatchVerificationUseCase,
    ListVerificationsUseCase,
    PullDocumentsUseCase,
    GetRevokedDocumentsUseCase,
  ],
  exports: [
    InfrastructureModule,
    CreateDocumentUseCase,
    GetDocumentUseCase,
    GetDocumentStatusUseCase,
    RevokeDocumentUseCase,
    UnrevokeDocumentUseCase,
    RegisterVerificationUseCase,
    BatchVerificationUseCase,
    ListVerificationsUseCase,
    PullDocumentsUseCase,
    GetRevokedDocumentsUseCase,
  ],
})
export class ApplicationModule {}
