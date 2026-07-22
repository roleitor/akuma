import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import { APP_NAME, APP_VERSION } from '@shared/constants/app.constants';

export const swaggerConfig = new DocumentBuilder()
  .setTitle(APP_NAME)
  .setDescription(
    `
    API para el sistema de validación de documentos Akuma QR.
    Este sistema permite la creación, verificación y gestión de documentos digitales
    mediante códigos QR con firmas digitales ECDSA.

    ## Autenticación
    La API utiliza JWT Bearer tokens para autenticación.
    Obtén tu token mediante el endpoint de login.

    ## Formatos
    Todas las respuestas son en formato JSON.
    Las fechas siguen el formato ISO 8601.
    `,
  )
  .setVersion(APP_VERSION)
  .addTag('Health', 'Endpoints de verificación de salud del sistema')
  .addTag('Auth', 'Endpoints de autenticación y gestión de usuarios')
  .addTag('Documents', 'Endpoints de gestión de documentos digitales')
  .addTag('Verifications', 'Endpoints de registro y consulta de verificaciones')
  .addTag('Sync', 'Endpoints de sincronización offline')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingresa tu token JWT',
      in: 'header',
    },
    'JWT-auth',
  )
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  swaggerOptions: {
    persistAuthorization: true,
    filter: true,
    displayRequestDuration: true,
  },
  customSiteTitle: `${APP_NAME} - API Docs`,
};
