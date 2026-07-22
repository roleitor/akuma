export const ErrorCodes = {
  DOCUMENT_NOT_FOUND: { code: 'DOCUMENT_NOT_FOUND', message: 'Document not found', statusCode: 404 },
  DOCUMENT_ALREADY_EXISTS: { code: 'DOCUMENT_ALREADY_EXISTS', message: 'Document already exists', statusCode: 409 },
  DOCUMENT_REVOKED: { code: 'DOCUMENT_REVOKED', message: 'Document is revoked', statusCode: 409 },
  DOCUMENT_NOT_REVOKED: { code: 'DOCUMENT_NOT_REVOKED', message: 'Document is not revoked', statusCode: 409 },
  DOCUMENT_INVALID_HASH: { code: 'DOCUMENT_INVALID_HASH', message: 'Invalid document hash', statusCode: 400 },

  VERIFICATION_NOT_FOUND: { code: 'VERIFICATION_NOT_FOUND', message: 'Verification not found', statusCode: 404 },

  USER_NOT_FOUND: { code: 'USER_NOT_FOUND', message: 'User not found', statusCode: 404 },
  USER_ALREADY_EXISTS: { code: 'USER_ALREADY_EXISTS', message: 'User already exists', statusCode: 409 },
  USER_INVALID_CREDENTIALS: { code: 'USER_INVALID_CREDENTIALS', message: 'Invalid credentials', statusCode: 401 },

  UNAUTHORIZED: { code: 'UNAUTHORIZED', message: 'Unauthorized', statusCode: 401 },
  FORBIDDEN: { code: 'FORBIDDEN', message: 'Forbidden', statusCode: 403 },

  INVALID_INPUT: { code: 'INVALID_INPUT', message: 'Invalid input', statusCode: 400 },
  INTERNAL_ERROR: { code: 'INTERNAL_ERROR', message: 'Internal server error', statusCode: 500 },

  SIGNATURE_INVALID: { code: 'SIGNATURE_INVALID', message: 'Invalid signature', statusCode: 400 },
  KEY_NOT_FOUND: { code: 'KEY_NOT_FOUND', message: 'Private key not found', statusCode: 500 },
} as const;

export type ErrorCode = keyof typeof ErrorCodes;
