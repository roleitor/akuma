import { Injectable, Inject } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { HashService } from '@domain/ports/services/hash-service.interface';
import { SignatureService } from '@domain/ports/services/signature-service.interface';
import { DocumentFactory } from '@domain/factories/document.factory';
import { QrPayload } from '@domain/value-objects/qr-payload.vo';
import { Document } from '@domain/entities/document.entity';
import { CreateDocumentDto } from '@application/dto/document/create-document.dto';
import { DocumentResponseDto } from '@application/dto/document/document-response.dto';
import { AppError } from '@shared/errors/app-error';
import { ErrorCodes } from '@shared/errors/error-codes';

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
    @Inject('HashService')
    private readonly hashService: HashService,
    @Inject('SignatureService')
    private readonly signatureService: SignatureService,
  ) {}

  async execute(dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    const dataToHash = {
      clientName: dto.clientName,
      transactionDate: dto.transactionDate,
      campaign: dto.campaign,
      location: dto.location,
      formData: dto.formData,
    };

    const hashDocument = this.hashService.calculateHashFromObject(dataToHash);
    const signature = await this.signatureService.sign(hashDocument);

    const document = DocumentFactory.create(
      dto.clientName,
      dto.transactionDate,
      dto.formData,
      hashDocument,
      signature,
      dto.campaign,
      dto.location,
    );

    const savedDocument = await this.documentRepository.save(document);

    const qrPayload = QrPayload.create(
      savedDocument.id,
      savedDocument.clientName,
      savedDocument.transactionDate,
      savedDocument.signature,
      savedDocument.campaign ?? undefined,
      savedDocument.location ?? undefined,
    );

    return this.toResponseDto(savedDocument, qrPayload.toBase64());
  }

  private toResponseDto(document: Document, qrPayloadBase64: string): DocumentResponseDto {
    return {
      id: document.id,
      clientName: document.clientName,
      transactionDate: document.transactionDate,
      campaign: document.campaign ?? undefined,
      location: document.location ?? undefined,
      formData: document.formData,
      hashDocument: document.hashDocument,
      signature: document.signature,
      qrPayload: qrPayloadBase64,
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
