import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, MinLength, MaxLength } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ description: 'Client name', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  clientName: string;

  @ApiProperty({ description: 'Transaction date (YYYY-MM-DD)', example: '2024-01-15' })
  @IsString()
  @IsNotEmpty()
  transactionDate: string;

  @ApiPropertyOptional({ description: 'Campaign name', example: 'Campaña Verano 2024' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  campaign?: string;

  @ApiPropertyOptional({ description: 'Location', example: 'Lima, Perú' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  location?: string;

  @ApiProperty({ description: 'Form data (dynamic fields)', example: { product: 'Laptop', quantity: 2 } })
  @IsObject()
  @IsNotEmpty()
  formData: Record<string, unknown>;
}
