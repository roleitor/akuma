import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { DocumentRepositoryImpl } from './repositories/document-repository.impl';
import { VerificationRepositoryImpl } from './repositories/verification-repository.impl';
import { UserRepositoryImpl } from './repositories/user-repository.impl';
import { RevokedDocumentRepositoryImpl } from './repositories/revoked-document-repository.impl';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: 'DocumentRepository',
      useClass: DocumentRepositoryImpl,
    },
    {
      provide: 'VerificationRepository',
      useClass: VerificationRepositoryImpl,
    },
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'RevokedDocumentRepository',
      useClass: RevokedDocumentRepositoryImpl,
    },
  ],
  exports: [
    PrismaService,
    'DocumentRepository',
    'VerificationRepository',
    'UserRepository',
    'RevokedDocumentRepository',
  ],
})
export class DatabaseModule {}
