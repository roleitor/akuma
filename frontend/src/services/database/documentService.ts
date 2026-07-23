import { offlineDB, type OfflineDocument } from '../database/offlineDB';
import { API_BASE_URL } from '../../utils/constants';

export class DocumentService {
  async getDocument(id: string): Promise<OfflineDocument | null> {
    // Try local cache first
    const localDoc = await offlineDB.getDocument(id);
    if (localDoc) return localDoc;

    // Try network if online
    if (!navigator.onLine) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}`);
      if (!response.ok) return null;

      const data = await response.json();
      if (data.success && data.data) {
        const doc: OfflineDocument = {
          ...data.data,
          synced: true,
        };
        await offlineDB.saveDocument(doc);
        return doc;
      }
    } catch (error) {
      console.error('[DocumentService] Failed to fetch document:', error);
    }

    return null;
  }

  async getAllDocuments(): Promise<OfflineDocument[]> {
    return offlineDB.getAllDocuments();
  }

  async checkDocumentStatus(id: string): Promise<'active' | 'revoked' | 'unknown'> {
    // Check local cache
    const doc = await offlineDB.getDocument(id);
    if (doc) return doc.status;

    // Check revoked list
    const revokedList = (await offlineDB.getMeta('revoked_list')) as string[] | undefined;
    if (revokedList?.includes(id)) return 'revoked';

    // Try network
    if (!navigator.onLine) return 'unknown';

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/documents/${id}/status`);
      if (!response.ok) return 'unknown';

      const data = await response.json();
      return data.success ? data.data.status : 'unknown';
    } catch (error) {
      console.error('[DocumentService] Failed to check status:', error);
      return 'unknown';
    }
  }

  async searchDocuments(query: string): Promise<OfflineDocument[]> {
    const allDocs = await offlineDB.getAllDocuments();
    const lowerQuery = query.toLowerCase();
    return allDocs.filter(
      (doc) =>
        doc.client_name.toLowerCase().includes(lowerQuery) ||
        doc.id.toLowerCase().includes(lowerQuery) ||
        doc.campaign?.toLowerCase().includes(lowerQuery)
    );
  }
}

export const documentService = new DocumentService();
