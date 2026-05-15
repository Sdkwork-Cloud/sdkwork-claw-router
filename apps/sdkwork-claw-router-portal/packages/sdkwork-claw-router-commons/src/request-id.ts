export function createRequestToken(prefix: string): string {
  const normalizedPrefix = prefix.trim() || 'request';
  const crypto = globalThis.crypto;
  if (!crypto) {
    throw new Error('Secure random source is unavailable for request token generation.');
  }

  const randomUuid = crypto.randomUUID?.();
  if (randomUuid) {
    return `${normalizedPrefix}-${randomUuid}`;
  }

  if (!crypto.getRandomValues) {
    throw new Error('Secure random source is unavailable for request token generation.');
  }

  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  if (randomPart !== '00000000000000000000000000000000') {
    return `${normalizedPrefix}-${randomPart}`;
  }

  throw new Error('Secure random source returned an invalid token seed.');
}

export function createRequestParams(prefix: string): { idempotencyKey: string; xRequestId: string } {
  const normalizedPrefix = prefix.trim() || 'request';
  return {
    idempotencyKey: createRequestToken(normalizedPrefix),
    xRequestId: createRequestToken(`${normalizedPrefix}-request`),
  };
}
