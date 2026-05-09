import type { RoutingStrategySnapshot } from './routing-strategy-snapshot';

export interface FetchStrategyResult {
  /** Business response code. */
  code: string;
  data?: RoutingStrategySnapshot;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
