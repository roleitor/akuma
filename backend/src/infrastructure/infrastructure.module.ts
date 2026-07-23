import { Module } from '@nestjs/common';
import { DatabaseModule } from './persistence/database.module';
import { SecurityModule } from './security/security.module';
import { QrModule } from './qr/qr.module';

@Module({
  imports: [DatabaseModule, SecurityModule, QrModule],
  exports: [DatabaseModule, SecurityModule, QrModule],
})
export class InfrastructureModule {}
