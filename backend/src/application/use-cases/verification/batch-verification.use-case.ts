import { Injectable, Inject } from '@nestjs/common';
import { VerificationRepository } from '@domain/ports/repositories/verification-repository.interface';
import { VerificationFactory } from '@domain/factories/verification.factory';
import { Verification } from '@domain/entities/verification.entity';
import { BatchVerificationDto } from '@application/dto/verification/batch-verification.dto';
import { VerificationResponseDto } from '@application/dto/verification/verification-response.dto';

@Injectable()
export class BatchVerificationUseCase {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(dto: BatchVerificationDto): Promise<VerificationResponseDto[]> {
    const verifications = dto.verifications.map((v) =>
      VerificationFactory.create(
        v.documentId,
        v.technicianId,
        v.technicianName,
        v.result,
        new Date(v.verificationDate),
        v.deviceId,
        v.latitude,
        v.longitude,
      ),
    );

    const saved = await this.verificationRepository.saveBatch(verifications);
    return saved.map((v) => this.toResponseDto(v));
  }

  private toResponseDto(verification: Verification): VerificationResponseDto {
    return {
      id: verification.id,
      documentId: verification.documentId,
      technicianId: verification.technicianId,
      technicianName: verification.technicianName,
      deviceId: verification.deviceId ?? undefined,
      verificationDate: verification.verificationDate,
      latitude: verification.latitude ?? undefined,
      longitude: verification.longitude ?? undefined,
      result: verification.result,
      synced: verification.synced,
      createdAt: verification.createdAt,
    };
  }
}
