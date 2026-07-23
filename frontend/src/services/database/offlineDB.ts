import { openDB, type IDBPDatabase } from 'idb';

const DB_NAME = 'akuma-qr-validator';
const DB_VERSION = 1;

export interface OfflineDocument {
  id: string;
  client_name: string;
  transaction_date: string;
  campaign?: string;
  location?: string;
  form_data: Record<string, unknown>;
  hash_document: string;
  signature: string;
  status: 'active' | 'revoked';
  created_at: string;
  updated_at: string;
  synced: boolean;
}

export interface OfflineVerification {
  id?: number;
  document_id: string;
  technician_id: string;
  technician_name: string;
  device_id?: string;
  verification_date: string;
  latitude?: number;
  longitude?: number;
  result: 'VALID' | 'INVALID' | 'REVOKED';
  synced: boolean;
  created_at: string;
}

export interface SyncQueueItem {
  id?: number;
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
  created_at: string;
}

class OfflineDatabase {
  private db: IDBPDatabase | null = null;

  async init(): Promise<void> {
    this.db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Store de documentos offline
        if (!db.objectStoreNames.contains('documents')) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' });
          docStore.createIndex('status', 'status');
          docStore.createIndex('synced', 'synced');
        }

        // Store de verificaciones offline
        if (!db.objectStoreNames.contains('verifications')) {
          const verStore = db.createObjectStore('verifications', {
            keyPath: 'id',
            autoIncrement: true,
          });
          verStore.createIndex('document_id', 'document_id');
          verStore.createIndex('synced', 'synced');
        }

        // Store de cola de sincronización
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', {
            keyPath: 'id',
            autoIncrement: true,
          });
          syncStore.createIndex('created_at', 'created_at');
        }

        // Store de metadata
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      },
    });
  }

  private ensureDB(): IDBPDatabase {
    if (!this.db) throw new Error('Database not initialized. Call init() first.');
    return this.db;
  }

  // === Documents ===

  async getDocument(id: string): Promise<OfflineDocument | undefined> {
    return this.ensureDB().get('documents', id);
  }

  async getAllDocuments(): Promise<OfflineDocument[]> {
    return this.ensureDB().getAll('documents');
  }

  async saveDocument(doc: OfflineDocument): Promise<void> {
    await this.ensureDB().put('documents', doc);
  }

  async saveDocuments(docs: OfflineDocument[]): Promise<void> {
    const tx = this.ensureDB().transaction('documents', 'readwrite');
    for (const doc of docs) {
      tx.store.put(doc);
    }
    await tx.done;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.ensureDB().delete('documents', id);
  }

  async getUnsyncedDocuments(): Promise<OfflineDocument[]> {
    const all = await this.getAllDocuments();
    return all.filter((d) => !d.synced);
  }

  // === Verifications ===

  async getVerification(id: number): Promise<OfflineVerification | undefined> {
    return this.ensureDB().get('verifications', id);
  }

  async getAllVerifications(): Promise<OfflineVerification[]> {
    return this.ensureDB().getAll('verifications');
  }

  async saveVerification(ver: OfflineVerification): Promise<number> {
    return this.ensureDB().add('verifications', ver) as Promise<number>;
  }

  async markVerificationSynced(id: number): Promise<void> {
    const ver = await this.getVerification(id);
    if (ver) {
      ver.synced = true;
      await this.ensureDB().put('verifications', ver);
    }
  }

  async getPendingVerifications(): Promise<OfflineVerification[]> {
    const all = await this.getAllVerifications();
    return all.filter((v) => !v.synced);
  }

  async deleteVerification(id: number): Promise<void> {
    await this.ensureDB().delete('verifications', id);
  }

  // === Sync Queue ===

  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<number> {
    return this.ensureDB().add('sync_queue', item) as Promise<number>;
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    return this.ensureDB().getAll('sync_queue');
  }

  async removeFromSyncQueue(id: number): Promise<void> {
    await this.ensureDB().delete('sync_queue', id);
  }

  async clearSyncQueue(): Promise<void> {
    await this.ensureDB().clear('sync_queue');
  }

  // === Metadata ===

  async getMeta(key: string): Promise<unknown> {
    const result = await this.ensureDB().get('meta', key);
    return result?.value;
  }

  async setMeta(key: string, value: unknown): Promise<void> {
    await this.ensureDB().put('meta', { key, value });
  }

  async getLastSyncTime(): Promise<string | null> {
    const result = await this.getMeta('last_sync');
    return result as string | null;
  }

  async setLastSyncTime(time: string): Promise<void> {
    await this.setMeta('last_sync', time);
  }

  // === Bulk Operations ===

  async clearAll(): Promise<void> {
    const db = this.ensureDB();
    const tx = db.transaction(
      ['documents', 'verifications', 'sync_queue', 'meta'],
      'readwrite'
    );
    await Promise.all([
      tx.objectStore('documents').clear(),
      tx.objectStore('verifications').clear(),
      tx.objectStore('sync_queue').clear(),
      tx.objectStore('meta').clear(),
      tx.done,
    ]);
  }

  async getStats(): Promise<{
    documents: number;
    verifications: number;
    pendingSync: number;
  }> {
    const docs = await this.getAllDocuments();
    const vers = await this.getAllVerifications();
    const queue = await this.getSyncQueue();
    return {
      documents: docs.length,
      verifications: vers.length,
      pendingSync: queue.length,
    };
  }
}

export const offlineDB = new OfflineDatabase();
