import { Controller, Post, Get, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateDocumentUseCase } from '@application/use-cases/document/create-document.use-case';
import { GetDocumentUseCase } from '@application/use-cases/document/get-document.use-case';
import { GetDocumentStatusUseCase } from '@application/use-cases/document/get-document-status.use-case';
import { RevokeDocumentUseCase } from '@application/use-cases/document/revoke-document.use-case';
import { UnrevokeDocumentUseCase } from '@application/use-cases/document/unrevoke-document.use-case';
import { CreateDocumentDto } from '@application/dto/document/create-document.dto';
import { DocumentResponseDto } from '@application/dto/document/document-response.dto';
import { DocumentStatusResponseDto } from '@application/dto/document/document-status-response.dto';
import { RevokeDocumentDto } from '@application/dto/document/revoke-document.dto';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';

@ApiTags('Documents')
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly createDocumentUseCase: CreateDocumentUseCase,
    private readonly getDocumentUseCase: GetDocumentUseCase,
    private readonly getDocumentStatusUseCase: GetDocumentStatusUseCase,
    private readonly revokeDocumentUseCase: RevokeDocumentUseCase,
    private readonly unrevokeDocumentUseCase: UnrevokeDocumentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo documento digital',
    description: 'Crea un documento digital con hash SHA-256 y firma ECDSA. Retorna el payload para generar el código QR.',
  })
  @ApiResponse({ status: 201, description: 'Documento creado exitosamente', type: DocumentResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(@Body() dto: CreateDocumentDto): Promise<DocumentResponseDto> {
    return this.createDocumentUseCase.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener documento por ID' })
  @ApiParam({ name: 'id', description: 'ID del documento', example: 'DOC-A1B2C3D4' })
  @ApiResponse({ status: 200, description: 'Documento encontrado' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  async findById(@Param('id') id: string): Promise<DocumentResponseDto> {
    const document = await this.getDocumentUseCase.execute(id);
    return {
      id: document.id,
      clientName: document.clientName,
      transactionDate: document.transactionDate,
      campaign: document.campaign ?? undefined,
      location: document.location ?? undefined,
      formData: document.formData,
      hashDocument: document.hashDocument,
      signature: document.signature,
      qrPayload: '',
      status: document.status,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Obtener estado de un documento' })
  @ApiParam({ name: 'id', description: 'ID del documento', example: 'DOC-A1B2C3D4' })
  @ApiResponse({ status: 200, description: 'Estado del documento', type: DocumentStatusResponseDto })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  async getStatus(@Param('id') id: string): Promise<DocumentStatusResponseDto> {
    return this.getDocumentStatusUseCase.execute(id);
  }

  @Post(':id/revoke')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Revocar un documento', description: 'Requiere autenticación JWT' })
  @ApiParam({ name: 'id', description: 'ID del documento a revocar', example: 'DOC-A1B2C3D4' })
  @ApiResponse({ status: 200, description: 'Documento revocado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  @ApiResponse({ status: 409, description: 'El documento ya está revocado' })
  async revoke(@Param('id') id: string, @Body() dto: RevokeDocumentDto): Promise<{ message: string }> {
    await this.revokeDocumentUseCase.execute(id, dto);
    return { message: 'Document revoked successfully' };
  }

  @Post(':id/unrevoke')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Restaurar un documento revocado', description: 'Requiere autenticación JWT' })
  @ApiParam({ name: 'id', description: 'ID del documento a restaurar', example: 'DOC-A1B2C3D4' })
  @ApiResponse({ status: 200, description: 'Documento restaurado exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  @ApiResponse({ status: 409, description: 'El documento no está revocado' })
  async unrevoke(@Param('id') id: string): Promise<{ message: string }> {
    await this.unrevokeDocumentUseCase.execute(id);
    return { message: 'Document unrevoked successfully' };
  }
}
