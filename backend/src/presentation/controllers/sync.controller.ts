import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PullDocumentsUseCase } from '@application/use-cases/sync/pull-documents.use-case';
import { GetRevokedDocumentsUseCase } from '@application/use-cases/sync/get-revoked-documents.use-case';
import { PullDocumentsDto } from '@application/dto/sync/pull-documents.dto';
import { SyncPullResponseDto, SyncRevokedResponseDto } from '@application/dto/sync/sync-response.dto';

@ApiTags('Sync')
@Controller('sync')
export class SyncController {
  constructor(
    private readonly pullDocumentsUseCase: PullDocumentsUseCase,
    private readonly getRevokedDocumentsUseCase: GetRevokedDocumentsUseCase,
  ) {}

  @Post('pull')
  @ApiOperation({ summary: 'Sincronizar documentos por lista de IDs' })
  @ApiResponse({ status: 200, description: 'Documentos sincronizados', type: SyncPullResponseDto })
  async pull(@Body() dto: PullDocumentsDto): Promise<SyncPullResponseDto> {
    return this.pullDocumentsUseCase.execute(dto);
  }

  @Get('revoked')
  @ApiOperation({ summary: 'Obtener lista de documentos revocados' })
  @ApiResponse({ status: 200, description: 'Lista de documentos revocados', type: SyncRevokedResponseDto })
  async getRevoked(): Promise<SyncRevokedResponseDto> {
    return this.getRevokedDocumentsUseCase.execute();
  }
}
