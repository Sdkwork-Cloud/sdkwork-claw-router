import type { GatewayTracesResponse } from './gateway-traces-response';

export interface FetchTracesResult {
  /** Business response code. */
  code: string;
  data?: GatewayTracesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
