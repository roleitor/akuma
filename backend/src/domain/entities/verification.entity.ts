import { VerificationResult } from '@shared/enums/verification-result.enum';

export class Verification {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public technicianId: string,
    public technicianName: string,
    public deviceId: string | null,
    public verificationDate: Date,
    public latitude: number | null,
    public longitude: number | null,
    public result: VerificationResult,
    public synced: boolean,
    public readonly createdAt: Date,
  ) {}

  static create(
    id: string,
    documentId: string,
    technicianId: string,
    technicianName: string,
    result: VerificationResult,
    verificationDate: Date,
    deviceId?: string,
    latitude?: number,
    longitude?: number,
  ): Verification {
    return new Verification(
      id,
      documentId,
      technicianId,
      technicianName,
      deviceId ?? null,
      verificationDate,
      latitude ?? null,
      longitude ?? null,
      result,
      true,
      new Date(),
    );
  }

  static createOffline(
    id: string,
    documentId: string,
    technicianId: string,
    technicianName: string,
    result: VerificationResult,
    verificationDate: Date,
    deviceId?: string,
    latitude?: number,
    longitude?: number,
  ): Verification {
    const verification = Verification.create(
      id, documentId, technicianId, technicianName,
      result, verificationDate, deviceId, latitude, longitude,
    );
    verification.synced = false;
    return verification;
  }

  markAsSynced(): void {
    this.synced = true;
  }
}
