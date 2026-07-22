import { Injectable } from '@nestjs/common';
import { SignatureService } from '@domain/ports/services/signature-service.interface';
import { KeyManagerImpl } from './key-manager.impl';
import * as crypto from 'crypto';

@Injectable()
export class SignatureServiceImpl implements SignatureService {
  constructor(private readonly keyManager: KeyManagerImpl) {}

  async sign(data: string): Promise<string> {
    const privateKey = await this.keyManager.getPrivateKey();
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(privateKey, 'base64');
    return signature;
  }

  async verify(data: string, signature: string, publicKey?: string): Promise<boolean> {
    const key = publicKey || (await this.keyManager.getPublicKey());
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(data);
      verify.end();
      return verify.verify(key, signature, 'base64');
    } catch {
      return false;
    }
  }
}
