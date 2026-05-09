import type { RoutingApiKeysResponse } from './routing-api-keys-response';

export interface FetchApiKeysResult {
  /** Business response code. */
  code: string;
  data?: RoutingApiKeysResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
