import { Module } from '@nestjs/common';
import { QrServiceImpl } from './qr-service.impl';

@Module({
  providers: [
    {
      provide: 'QrService',
      useClass: QrServiceImpl,
    },
  ],
  exports: ['QrService'],
})
export class QrModule {}
