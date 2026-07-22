import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { swaggerConfig, swaggerCustomOptions } from '@config/swagger.config';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api');
  const apiVersion = configService.get<string>('app.apiVersion', 'v1');
  const corsOrigins = configService.get<string[]>('app.corsOrigins', ['*']);
  const swaggerEnabled = configService.get<boolean>('app.swaggerEnabled', true);
  const swaggerPath = configService.get<string>('app.swaggerPath', 'api/docs');

  app.setGlobalPrefix(`${apiPrefix}/${apiVersion}`);

  app.enableCors({
    origin: corsOrigins.includes('*') ? '*' : corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (swaggerEnabled) {
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup(swaggerPath, app, document, swaggerCustomOptions);
    logger.log(`Swagger docs available at http://localhost:${port}/${swaggerPath}`);
  }

  await app.listen(port);
  logger.log(`Application is running on http://localhost:${port}/${apiPrefix}/${apiVersion}`);
  logger.log(`Environment: ${configService.get<string>('app.nodeEnv')}`);
}

bootstrap();
