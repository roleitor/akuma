interface PendingVerification {
  id: string;
  document_id: string;
  technician_id: string;
  technician_name: string;
  result: string;
  verification_date: string;
}

interface RevokedItem {
  document_id: string;
  reason?: string;
  revoked_at: string;
}

export class DatabaseService {
  async getPendingVerifications(): Promise<PendingVerification[]> {
    return [];
  }

  async markVerificationSynced(_id: string): Promise<void> {}

  async updateRevokedList(_revoked: RevokedItem[]): Promise<void> {}
}
