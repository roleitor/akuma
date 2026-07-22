import { Controller, Post, Get, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RegisterVerificationUseCase } from '@application/use-cases/verification/register-verification.use-case';
import { BatchVerificationUseCase } from '@application/use-cases/verification/batch-verification.use-case';
import { ListVerificationsUseCase, ListVerificationsQuery } from '@application/use-cases/verification/list-verifications.use-case';
import { RegisterVerificationDto } from '@application/dto/verification/register-verification.dto';
import { BatchVerificationDto } from '@application/dto/verification/batch-verification.dto';
import { VerificationResponseDto } from '@application/dto/verification/verification-response.dto';
import { VerificationListResponseDto } from '@application/dto/verification/verification-list-response.dto';

@ApiTags('Verifications')
@Controller('verifications')
export class VerificationController {
  constructor(
    private readonly registerVerificationUseCase: RegisterVerificationUseCase,
    private readonly batchVerificationUseCase: BatchVerificationUseCase,
    private readonly listVerificationsUseCase: ListVerificationsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una verificación individual' })
  @ApiResponse({ status: 201, description: 'Verificación registrada', type: VerificationResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async register(@Body() dto: RegisterVerificationDto): Promise<VerificationResponseDto> {
    return this.registerVerificationUseCase.execute(dto);
  }

  @Post('batch')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar múltiples verificaciones en lote' })
  @ApiResponse({ status: 201, description: 'Verificaciones registradas', type: [VerificationResponseDto] })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async batch(@Body() dto: BatchVerificationDto): Promise<VerificationResponseDto[]> {
    return this.batchVerificationUseCase.execute(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar verificaciones con filtros' })
  @ApiQuery({ name: 'documentId', required: false, description: 'Filtrar por ID de documento' })
  @ApiQuery({ name: 'technicianId', required: false, description: 'Filtrar por ID de técnico' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin (ISO 8601)' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Ítems por página', example: 20 })
  @ApiResponse({ status: 200, description: 'Lista de verificaciones', type: VerificationListResponseDto })
  async findAll(
    @Query('documentId') documentId?: string,
    @Query('technicianId') technicianId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<VerificationListResponseDto> {
    const query: ListVerificationsQuery = { documentId, technicianId, startDate, endDate, page, limit };
    return this.listVerificationsUseCase.execute(query);
  }
}
