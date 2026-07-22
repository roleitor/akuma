import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { APP_NAME, APP_VERSION } from '@shared/constants/app.constants';

@ApiTags('Health')
@Controller()
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del servidor' })
  @ApiResponse({ status: 200, description: 'Servidor funcionando correctamente' })
  checkHealth(): Record<string, unknown> {
    return {
      status: 'healthy',
      version: APP_VERSION,
      name: APP_NAME,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Información del proyecto' })
  @ApiResponse({ status: 200, description: 'Información del proyecto' })
  getRoot(): Record<string, unknown> {
    return {
      name: APP_NAME,
      version: APP_VERSION,
      description: 'Sistema de validación de documentos mediante QR con firmas digitales ECDSA',
      docs: '/api/docs',
    };
  }
}
