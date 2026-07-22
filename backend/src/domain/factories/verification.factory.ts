import { Verification } from '@domain/entities/verification.entity';
import { VerificationResult } from '@shared/enums/verification-result.enum';
import { v4 as uuidv4 } from 'uuid';

export class VerificationFactory {
  static create(
    documentId: string,
    technicianId: string,
    technicianName: string,
    result: VerificationResult,
    verificationDate: Date,
    deviceId?: string,
    latitude?: number,
    longitude?: number,
  ): Verification {
    const id = uuidv4();
    return Verification.create(id, documentId, technicianId, technicianName, result, verificationDate, deviceId, latitude, longitude);
  }

  static createOffline(
    documentId: string,
    technicianId: string,
    technicianName: string,
    result: VerificationResult,
    verificationDate: Date,
    deviceId?: string,
    latitude?: number,
    longitude?: number,
  ): Verification {
    const id = uuidv4();
    return Verification.createOffline(id, documentId, technicianId, technicianName, result, verificationDate, deviceId, latitude, longitude);
  }
}
