import type { RoutingRequestTracesResponse } from './routing-request-traces-response';

export interface FetchRequestTracesResult {
  /** Business response code. */
  code: string;
  data?: RoutingRequestTracesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
