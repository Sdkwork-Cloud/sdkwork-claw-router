import type { ProvidersResponse } from './providers-response';

export interface FetchProvidersResult {
  /** Business response code. */
  code: string;
  data?: ProvidersResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
