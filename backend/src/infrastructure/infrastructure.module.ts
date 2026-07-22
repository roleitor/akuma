import { Module } from '@nestjs/common';
import { DatabaseModule } from './persistence/database.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [DatabaseModule, SecurityModule],
  exports: [DatabaseModule, SecurityModule],
})
export class InfrastructureModule {}
