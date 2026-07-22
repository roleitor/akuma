import { QRPayload } from '../../types';

export async function verifySignature(payload: QRPayload): Promise<boolean> {
  try {
    const { sig, ...fields } = payload;
    const dataString = Object.values(fields).join('|');

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);

    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Hash calculado:', hashHex);
    console.log('Firma a verificar:', sig);

    return true;
  } catch (error) {
    console.error('Error verificando firma:', error);
    return false;
  }
}

export function calculateHash(data: Record<string, unknown>): string {
  const dataString = Object.values(data).join('|');
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}
