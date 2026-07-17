import { Network } from '@capacitor/network';
import { DatabaseService } from './database/sqlite';
import { API_BASE_URL } from '../utils/constants';

export class SyncService {
  private db: DatabaseService;
  private isSyncing = false;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  async checkNetwork(): Promise<boolean> {
    const status = await Network.getStatus();
    return status.connected;
  }

  async syncPendingVerifications(): Promise<void> {
    if (this.isSyncing) return;
    this.isSyncing = true;

    try {
      const connected = await this.checkNetwork();
      if (!connected) return;

      const pending = await this.db.getPendingVerifications();

      for (const verification of pending) {
        try {
          await fetch(`${API_BASE_URL}/api/verifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verification),
          });
          await this.db.markVerificationSynced(verification.id);
        } catch (error) {
          console.error('Error syncing verification:', error);
        }
      }
    } finally {
      this.isSyncing = false;
    }
  }

  async syncRevokedList(): Promise<void> {
    const connected = await this.checkNetwork();
    if (!connected) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/sync/revoked`);
      const data = await response.json();
      if (data.success) {
        await this.db.updateRevokedList(data.data.revoked);
      }
    } catch (error) {
      console.error('Error syncing revoked list:', error);
    }
  }

  async fullSync(): Promise<void> {
    await this.syncPendingVerifications();
    await this.syncRevokedList();
  }
}
