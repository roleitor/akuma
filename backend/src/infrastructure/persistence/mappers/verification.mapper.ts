import { Verification as PrismaVerification } from '@prisma-generated/client';
import { Verification } from '@domain/entities/verification.entity';
import { VerificationResult } from '@shared/enums/verification-result.enum';

export class VerificationMapper {
  static toDomain(entity: PrismaVerification): Verification {
    return new Verification(
      entity.id,
      entity.documentId,
      entity.technicianId,
      entity.technicianName,
      entity.deviceId,
      entity.verificationDate,
      entity.latitude,
      entity.longitude,
      entity.result as VerificationResult,
      entity.synced,
      entity.createdAt,
    );
  }

  static toPersistence(domain: Verification): {
    id: string;
    documentId: string;
    technicianId: string;
    technicianName: string;
    deviceId: string | null;
    verificationDate: Date;
    latitude: number | null;
    longitude: number | null;
    result: string;
    synced: boolean;
    createdAt: Date;
  } {
    return {
      id: domain.id,
      documentId: domain.documentId,
      technicianId: domain.technicianId,
      technicianName: domain.technicianName,
      deviceId: domain.deviceId,
      verificationDate: domain.verificationDate,
      latitude: domain.latitude,
      longitude: domain.longitude,
      result: domain.result,
      synced: domain.synced,
      createdAt: domain.createdAt,
    };
  }
}
