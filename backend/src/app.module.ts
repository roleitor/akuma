import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import securityConfig from '@config/security.config';
import cacheConfig from '@config/cache.config';
import { PresentationModule } from '@presentation/presentation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, securityConfig, cacheConfig],
      envFilePath: '.env',
    }),
    PresentationModule,
  ],
})
export class AppModule {}
