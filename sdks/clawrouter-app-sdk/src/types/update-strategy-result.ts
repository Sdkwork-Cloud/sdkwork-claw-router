import type { UpdateRoutingStrategyResponse } from './update-routing-strategy-response';

export interface UpdateStrategyResult {
  /** Business response code. */
  code: string;
  data?: UpdateRoutingStrategyResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
