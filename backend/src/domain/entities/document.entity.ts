import { DocumentStatus } from '@shared/enums/document-status.enum';

export class Document {
  constructor(
    public readonly id: string,
    public clientName: string,
    public transactionDate: string,
    public campaign: string | null,
    public location: string | null,
    public formData: Record<string, unknown>,
    public hashDocument: string,
    public signature: string,
    public status: DocumentStatus,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    id: string,
    clientName: string,
    transactionDate: string,
    formData: Record<string, unknown>,
    hashDocument: string,
    signature: string,
    campaign?: string,
    location?: string,
  ): Document {
    const now = new Date();
    return new Document(
      id,
      clientName,
      transactionDate,
      campaign ?? null,
      location ?? null,
      formData,
      hashDocument,
      signature,
      DocumentStatus.ACTIVE,
      now,
      now,
    );
  }

  isRevoked(): boolean {
    return this.status === DocumentStatus.REVOKED;
  }

  revoke(): void {
    if (this.isRevoked()) {
      throw new Error('Document is already revoked');
    }
    this.status = DocumentStatus.REVOKED;
    this.updatedAt = new Date();
  }

  unrevoke(): void {
    if (!this.isRevoked()) {
      throw new Error('Document is not revoked');
    }
    this.status = DocumentStatus.ACTIVE;
    this.updatedAt = new Date();
  }

  updateDetails(clientName: string, transactionDate: string, campaign: string | null, location: string | null): void {
    this.clientName = clientName;
    this.transactionDate = transactionDate;
    this.campaign = campaign;
    this.location = location;
    this.updatedAt = new Date();
  }
}
