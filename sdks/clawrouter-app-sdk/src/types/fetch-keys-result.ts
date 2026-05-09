import type { AppApiKeyListResponse } from './app-api-key-list-response';

export interface FetchKeysResult {
  /** Business response code. */
  code: string;
  data?: AppApiKeyListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
