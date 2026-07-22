import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyManager, KeyPair } from '@domain/ports/services/key-manager.interface';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

@Injectable()
export class KeyManagerImpl implements KeyManager {
  private readonly logger = new Logger(KeyManagerImpl.name);
  private readonly privateKeyPath: string;
  private readonly publicKeyPath: string;

  constructor(private readonly configService: ConfigService) {
    this.privateKeyPath = this.configService.get<string>('security.privateKeyPath') || './keys/private.pem';
    this.publicKeyPath = this.configService.get<string>('security.publicKeyPath') || './keys/public.pem';
  }

  async getPrivateKey(): Promise<string> {
    const keys = await this.loadOrGenerateKeys();
    return keys.privateKey;
  }

  async getPublicKey(): Promise<string> {
    const keys = await this.loadOrGenerateKeys();
    return keys.publicKey;
  }

  async loadOrGenerateKeys(): Promise<KeyPair> {
    if (fs.existsSync(this.privateKeyPath) && fs.existsSync(this.publicKeyPath)) {
      return {
        privateKey: fs.readFileSync(this.privateKeyPath, 'utf-8'),
        publicKey: fs.readFileSync(this.publicKeyPath, 'utf-8'),
      };
    }

    this.logger.warn('ECDSA keys not found, generating new key pair...');
    const keyPair = await this.generateKeyPair();
    this.ensureKeysDirectory();
    fs.writeFileSync(this.privateKeyPath, keyPair.privateKey, { mode: 0o600 });
    fs.writeFileSync(this.publicKeyPath, keyPair.publicKey);
    this.logger.log(`ECDSA keys generated and saved to ${this.privateKeyPath}`);
    return keyPair;
  }

  async generateKeyPair(): Promise<KeyPair> {
    return new Promise((resolve, reject) => {
      const { generateKeyPair } = crypto;
      generateKeyPair(
        'ec',
        {
          namedCurve: 'P-256',
          publicKeyEncoding: { type: 'spki', format: 'pem' },
          privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        },
        (err, publicKey, privateKey) => {
          if (err) reject(err);
          else resolve({ privateKey, publicKey });
        },
      );
    });
  }

  private ensureKeysDirectory(): void {
    const dir = path.dirname(this.privateKeyPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
}
