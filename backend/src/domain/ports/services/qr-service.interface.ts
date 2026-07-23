export interface QrOptions {
  width?: number;
  margin?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QrService {
  generateQrCode(data: string, options?: QrOptions): Promise<Buffer>;
  generateQrCodeWithLogo(data: string, logoPath?: string, options?: QrOptions): Promise<Buffer>;
}
