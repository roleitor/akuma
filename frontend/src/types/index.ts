export interface Document {
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
}

export interface QRPayload {
  v: string;
  txn: string;
  cli: string;
  fec: string;
  cam?: string;
  loc?: string;
  ts: number;
  sig: string;
}

export interface Verification {
  id: number;
  document_id: string;
  technician_id: string;
  technician_name: string;
  device_id?: string;
  verification_date: string;
  latitude?: number;
  longitude?: number;
  result: 'VALID' | 'INVALID' | 'REVOKED';
  synced: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'technician';
}

export interface VerificationResult {
  valid: boolean;
  transaction?: QRPayload;
  reason: 'OK' | 'FIRMA_INVÁLIDA' | 'NO_EN_BASE' | 'REVOCADO';
}
