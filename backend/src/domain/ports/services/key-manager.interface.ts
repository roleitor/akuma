export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface KeyManager {
  getPrivateKey(): Promise<string>;
  getPublicKey(): Promise<string>;
  generateKeyPair(): Promise<KeyPair>;
  loadOrGenerateKeys(): Promise<KeyPair>;
}
