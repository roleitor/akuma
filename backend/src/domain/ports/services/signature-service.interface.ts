export interface SignatureService {
  sign(data: string): Promise<string>;
  verify(data: string, signature: string, publicKey: string): Promise<boolean>;
}
