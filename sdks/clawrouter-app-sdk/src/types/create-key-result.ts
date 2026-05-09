import type { CreateApiKeyResponse } from './create-api-key-response';

export interface CreateKeyResult {
  /** Business response code. */
  code: string;
  data?: CreateApiKeyResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
