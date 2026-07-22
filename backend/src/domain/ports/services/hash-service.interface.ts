export interface HashService {
  calculateHash(data: string): string;
  calculateHashFromObject(data: Record<string, unknown>): string;
  verifyHash(data: string, hash: string): boolean;
}
