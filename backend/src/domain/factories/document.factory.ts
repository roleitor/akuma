import { Document } from '@domain/entities/document.entity';
import { v4 as uuidv4 } from 'uuid';
import { DateUtil } from '@shared/utils/date.util';

export class DocumentFactory {
  static create(
    clientName: string,
    transactionDate: string,
    formData: Record<string, unknown>,
    hashDocument: string,
    signature: string,
    campaign?: string,
    location?: string,
  ): Document {
    const id = DocumentFactory.generateId();
    return Document.create(id, clientName, transactionDate, formData, hashDocument, signature, campaign, location);
  }

  static generateId(): string {
    const shortId = uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `DOC-${shortId}`;
  }

  static createFromPayload(
    clientName: string,
    transactionDate: string,
    formData: Record<string, unknown>,
    hashDocument: string,
    signature: string,
    campaign?: string,
    location?: string,
    id?: string,
  ): Document {
    const documentId = id || DocumentFactory.generateId();
    return Document.create(documentId, clientName, transactionDate, formData, hashDocument, signature, campaign, location);
  }
}
