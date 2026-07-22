export class RevokedDocument {
  constructor(
    public readonly documentId: string,
    public reason: string | null,
    public revokedBy: string | null,
    public readonly revokedAt: Date,
  ) {}

  static create(documentId: string, reason?: string, revokedBy?: string): RevokedDocument {
    return new RevokedDocument(documentId, reason ?? null, revokedBy ?? null, new Date());
  }
}
