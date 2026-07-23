import { Injectable, Logger } from '@nestjs/common';
import * as QRCode from 'qrcode';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { QrService, QrOptions } from '@domain/ports/services/qr-service.interface';

@Injectable()
export class QrServiceImpl implements QrService {
  private readonly logger = new Logger(QrServiceImpl.name);
  private readonly defaultLogoPath: string;

  constructor() {
    // __dirname en runtime: backend/dist/infrastructure/qr/
    this.defaultLogoPath = path.resolve(__dirname, '../../../../frontend/public/favicon.svg');
  }

  async generateQrCode(data: string, options: QrOptions = {}): Promise<Buffer> {
    const {
      width = 400,
      margin = 2,
      errorCorrectionLevel = 'H',
    } = options;

    const qrBuffer = await QRCode.toBuffer(data, {
      type: 'png',
      width,
      margin,
      errorCorrectionLevel,
      color: {
        dark: '#1a1a2e',
        light: '#ffffff',
      },
    });

    return qrBuffer;
  }

  async generateQrCodeWithLogo(
    data: string,
    logoPath?: string,
    options: QrOptions = {},
  ): Promise<Buffer> {
    const qrBuffer = await this.generateQrCode(data, options);

    const logoFile = logoPath || this.defaultLogoPath;

    try {
      if (!fs.existsSync(logoFile)) {
        this.logger.warn(`Logo file not found: ${logoFile}, generating QR without logo`);
        return qrBuffer;
      }

      const qrMetadata = await sharp(qrBuffer).metadata();
      const qrSize = Math.min(qrMetadata.width || 400, qrMetadata.height || 400);
      const logoSize = Math.round(qrSize * 0.22);

      const logoBuffer = await sharp(logoFile)
        .resize(logoSize, logoSize, { fit: 'contain' })
        .png()
        .toBuffer();

      const logoWithPadding = await sharp({
        create: {
          width: logoSize + 12,
          height: logoSize + 12,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .composite([
          {
            input: logoBuffer,
            top: 6,
            left: 6,
          },
        ])
        .png()
        .toBuffer();

      const result = await sharp(qrBuffer)
        .composite([
          {
            input: logoWithPadding,
            gravity: 'center',
          },
        ])
        .png()
        .toBuffer();

      return result;
    } catch (error) {
      this.logger.error(`Error adding logo to QR: ${(error as Error).message}`);
      this.logger.warn('Returning QR code without logo');
      return qrBuffer;
    }
  }
}
