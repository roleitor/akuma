import { Injectable, Inject } from '@nestjs/common';
import { VerificationRepository } from '@domain/ports/repositories/verification-repository.interface';
import { VerificationFactory } from '@domain/factories/verification.factory';
import { Verification } from '@domain/entities/verification.entity';
import { RegisterVerificationDto } from '@application/dto/verification/register-verification.dto';
import { VerificationResponseDto } from '@application/dto/verification/verification-response.dto';

@Injectable()
export class RegisterVerificationUseCase {
  constructor(
    @Inject('VerificationRepository')
    private readonly verificationRepository: VerificationRepository,
  ) {}

  async execute(dto: RegisterVerificationDto): Promise<VerificationResponseDto> {
    const verification = VerificationFactory.create(
      dto.documentId,
      dto.technicianId,
      dto.technicianName,
      dto.result,
      new Date(dto.verificationDate),
      dto.deviceId,
      dto.latitude,
      dto.longitude,
    );

    const saved = await this.verificationRepository.save(verification);
    return this.toResponseDto(saved);
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
