import type { AdminApiKeyCreateResponse } from './admin-api-key-create-response';

export interface CreateApiKeyResult {
  /** Business response code. */
  code: string;
  data?: AdminApiKeyCreateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
