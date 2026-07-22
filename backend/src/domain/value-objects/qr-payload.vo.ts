export class QrPayload {
  constructor(
    public readonly version: string,
    public readonly transactionId: string,
    public readonly clientName: string,
    public readonly date: string,
    public readonly campaign: string | null,
    public readonly location: string | null,
    public readonly timestamp: number,
    public readonly signature: string,
  ) {}

  static create(
    transactionId: string,
    clientName: string,
    date: string,
    signature: string,
    campaign?: string,
    location?: string,
  ): QrPayload {
    return new QrPayload('1', transactionId, clientName, date, campaign ?? null, location ?? null, Date.now(), signature);
  }

  toJSON(): Record<string, unknown> {
    const payload: Record<string, unknown> = {
      v: this.version,
      txn: this.transactionId,
      cli: this.clientName,
      fec: this.date,
      ts: this.timestamp,
      sig: this.signature,
    };
    if (this.campaign) payload.cam = this.campaign;
    if (this.location) payload.loc = this.location;
    return payload;
  }

  static fromJSON(data: Record<string, unknown>): QrPayload {
    return new QrPayload(
      (data.v as string) || '1',
      data.txn as string,
      data.cli as string,
      data.fec as string,
      (data.cam as string) || null,
      (data.loc as string) || null,
      data.ts as number,
      data.sig as string,
    );
  }

  toBase64(): string {
    return Buffer.from(JSON.stringify(this.toJSON())).toString('base64');
  }

  static fromBase64(encoded: string): QrPayload {
    const json = JSON.parse(Buffer.from(encoded, 'base64').toString('utf-8'));
    return QrPayload.fromJSON(json);
  }
}
