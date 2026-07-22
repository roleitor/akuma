import { Injectable } from '@nestjs/common';
import { HashService } from '@domain/ports/services/hash-service.interface';
import * as crypto from 'crypto';

@Injectable()
export class HashServiceImpl implements HashService {
  calculateHash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  calculateHashFromObject(data: Record<string, unknown>): string {
    const normalized = this.normalizeObject(data);
    const jsonString = JSON.stringify(normalized, Object.keys(normalized).sort());
    return this.calculateHash(jsonString);
  }

  verifyHash(data: string, hash: string): boolean {
    const computed = this.calculateHash(data);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  }

  private normalizeObject(data: Record<string, unknown>): Record<string, unknown> {
    const normalized: Record<string, unknown> = {};
    for (const key of Object.keys(data).sort()) {
      const value = data[key];
      if (value !== undefined && value !== null) {
        normalized[key] = value;
      }
    }
    return normalized;
  }
}
