import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ApplicationModule } from '@application/application.module';
import { HealthController } from './controllers/health.controller';
import { DocumentController } from './controllers/document.controller';
import { VerificationController } from './controllers/verification.controller';
import { SyncController } from './controllers/sync.controller';
import { AuthController } from './controllers/auth.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ResponseTransformInterceptor } from './interceptors/response-transform.interceptor';

@Module({
  imports: [ApplicationModule],
  controllers: [
    HealthController,
    DocumentController,
    VerificationController,
    SyncController,
    AuthController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
  ],
})
export class PresentationModule {}
