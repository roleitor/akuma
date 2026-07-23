import { offlineDB, type OfflineDocument, type OfflineVerification } from '../database/offlineDB';
import { API_BASE_URL } from '../../utils/constants';

interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: string | null;
  pendingCount: number;
}

type SyncStatusCallback = (status: SyncStatus) => void;

class SyncManager {
  private statusCallbacks: SyncStatusCallback[] = [];
  private syncInterval: ReturnType<typeof setInterval> | null = null;
  private isSyncing = false;

  // === Status Management ===

  onStatusChange(callback: SyncStatusCallback): () => void {
    this.statusCallbacks.push(callback);
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter((cb) => cb !== callback);
    };
  }

  private async notifyStatus(): Promise<void> {
    const isOnline = navigator.onLine;
    const lastSyncTime = await offlineDB.getLastSyncTime();
    const pending = await offlineDB.getPendingVerifications();
    const status: SyncStatus = {
      isOnline,
      isSyncing: this.isSyncing,
      lastSyncTime,
      pendingCount: pending.length,
    };
    this.statusCallbacks.forEach((cb) => cb(status));
  }

  // === Init ===

  async init(): Promise<void> {
    await offlineDB.init();

    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Start periodic sync when online
    if (navigator.onLine) {
      this.startPeriodicSync();
    }

    await this.notifyStatus();
  }

  private handleOnline(): void {
    console.log('[SyncManager] Back online, starting sync...');
    this.startPeriodicSync();
    this.syncAll();
  }

  private handleOffline(): void {
    console.log('[SyncManager] Gone offline');
    this.stopPeriodicSync();
    this.notifyStatus();
  }

  // === Periodic Sync ===

  private startPeriodicSync(): void {
    if (this.syncInterval) return;
    this.syncInterval = setInterval(() => {
      if (navigator.onLine) {
        this.syncAll();
      }
    }, 30000); // Every 30 seconds
  }

  private stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // === Sync Operations ===

  async syncAll(): Promise<void> {
    if (this.isSyncing || !navigator.onLine) return;

    this.isSyncing = true;
    await this.notifyStatus();

    try {
      await this.syncPendingVerifications();
      await this.syncRevokedList();
      await this.syncDocuments();
      await offlineDB.setLastSyncTime(new Date().toISOString());
    } catch (error) {
      console.error('[SyncManager] Sync error:', error);
    } finally {
      this.isSyncing = false;
      await this.notifyStatus();
    }
  }

  private async syncPendingVerifications(): Promise<void> {
    const pending = await offlineDB.getPendingVerifications();
    if (pending.length === 0) return;

    console.log(`[SyncManager] Syncing ${pending.length} pending verifications...`);

    for (const verification of pending) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/verifications`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            document_id: verification.document_id,
            technician_id: verification.technician_id,
            technician_name: verification.technician_name,
            device_id: verification.device_id,
            verification_date: verification.verification_date,
            latitude: verification.latitude,
            longitude: verification.longitude,
            result: verification.result,
          }),
        });

        if (response.ok && verification.id) {
          await offlineDB.markVerificationSynced(verification.id);
        }
      } catch (error) {
        console.error('[SyncManager] Failed to sync verification:', error);
      }
    }
  }

  private async syncRevokedList(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/sync/revoked`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.success && data.data?.revoked) {
        await offlineDB.setMeta('revoked_list', data.data.revoked);
      }
    } catch (error) {
      console.error('[SyncManager] Failed to sync revoked list:', error);
    }
  }

  private async syncDocuments(): Promise<void> {
    try {
      const lastSync = await offlineDB.getLastSyncTime();
      const response = await fetch(`${API_BASE_URL}/api/v1/sync/pull`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          last_sync: lastSync,
        }),
      });

      if (!response.ok) return;

      const data = await response.json();
      if (data.success && data.data?.documents) {
        const docs: OfflineDocument[] = data.data.documents.map(
          (doc: Omit<OfflineDocument, 'synced'>) => ({
            ...doc,
            synced: true,
          })
        );
        await offlineDB.saveDocuments(docs);
      }
    } catch (error) {
      console.error('[SyncManager] Failed to sync documents:', error);
    }
  }

  // === Local Operations ===

  async saveVerificationLocally(
    verification: Omit<OfflineVerification, 'synced' | 'created_at'>
  ): Promise<number> {
    const fullVerification: OfflineVerification = {
      ...verification,
      synced: false,
      created_at: new Date().toISOString(),
    };

    const id = await offlineDB.saveVerification(fullVerification);

    // Try to sync immediately if online
    if (navigator.onLine) {
      this.syncPendingVerifications();
    }

    await this.notifyStatus();
    return id;
  }

  async saveDocumentLocally(doc: OfflineDocument): Promise<void> {
    await offlineDB.saveDocument({ ...doc, synced: false });
    await this.notifyStatus();
  }

  async getDocument(id: string): Promise<OfflineDocument | undefined> {
    return offlineDB.getDocument(id);
  }

  async getAllDocuments(): Promise<OfflineDocument[]> {
    return offlineDB.getAllDocuments();
  }

  async getAllVerifications(): Promise<OfflineVerification[]> {
    return offlineDB.getAllVerifications();
  }

  async getPendingCount(): Promise<number> {
    const pending = await offlineDB.getPendingVerifications();
    return pending.length;
  }

  async isDocumentRevoked(id: string): Promise<boolean> {
    const revokedList = (await offlineDB.getMeta('revoked_list')) as string[] | undefined;
    return revokedList?.includes(id) ?? false;
  }

  // === Cleanup ===

  destroy(): void {
    this.stopPeriodicSync();
    window.removeEventListener('online', () => this.handleOnline());
    window.removeEventListener('offline', () => this.handleOffline());
    this.statusCallbacks = [];
  }
}

export const syncManager = new SyncManager();
