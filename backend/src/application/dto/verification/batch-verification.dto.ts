import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { RegisterVerificationDto } from './register-verification.dto';

export class BatchVerificationDto {
  @ApiProperty({ description: 'List of verifications', type: [RegisterVerificationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RegisterVerificationDto)
  verifications: RegisterVerificationDto[];
}
