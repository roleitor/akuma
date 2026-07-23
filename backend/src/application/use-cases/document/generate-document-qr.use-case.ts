import { Injectable, Inject, Logger } from '@nestjs/common';
import { DocumentRepository } from '@domain/ports/repositories/document-repository.interface';
import { QrService } from '@domain/ports/services/qr-service.interface';
import { QrPayload } from '@domain/value-objects/qr-payload.vo';
import { AppError } from '@shared/errors/app-error';
import { ErrorCodes } from '@shared/errors/error-codes';

export interface GenerateDocumentQrParams {
  width?: number;
  margin?: number;
}

@Injectable()
export class GenerateDocumentQrUseCase {
  private readonly logger = new Logger(GenerateDocumentQrUseCase.name);

  constructor(
    @Inject('DocumentRepository')
    private readonly documentRepository: DocumentRepository,
    @Inject('QrService')
    private readonly qrService: QrService,
  ) {}

  async execute(id: string, params: GenerateDocumentQrParams = {}): Promise<Buffer> {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new AppError(
        ErrorCodes.DOCUMENT_NOT_FOUND.code,
        ErrorCodes.DOCUMENT_NOT_FOUND.message,
        ErrorCodes.DOCUMENT_NOT_FOUND.statusCode,
      );
    }

    const qrPayload = QrPayload.create(
      document.id,
      document.clientName,
      document.transactionDate,
      document.signature,
      document.campaign ?? undefined,
      document.location ?? undefined,
    );

    const payloadBase64 = qrPayload.toBase64();

    this.logger.log(`Generating QR code for document: ${id}`);

    const qrBuffer = await this.qrService.generateQrCodeWithLogo(payloadBase64, undefined, {
      width: params.width || 400,
      margin: params.margin ?? 2,
      errorCorrectionLevel: 'H',
    });

    return qrBuffer;
  }
}
