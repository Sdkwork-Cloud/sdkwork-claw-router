import type { GatewayTracesResponse } from './gateway-traces-response';

/** Gateway traces list result schema exposed by Claw Router. */
export interface GatewayTracesListResult {
  /** Business response code. */
  code: string;
  /** Data field on gateway traces list result. */
  data?: GatewayTracesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
