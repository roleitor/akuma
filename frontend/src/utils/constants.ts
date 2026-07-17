export const API_BASE_URL = 'http://localhost:8000';

export const QR_VERSION = '1.0';

export const VERIFICATION_RESULTS = {
  VALID: 'VALID',
  INVALID: 'INVALID',
  REVOKED: 'REVOKED',
} as const;

export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',
  LAST_SYNC: 'last_sync',
} as const;
