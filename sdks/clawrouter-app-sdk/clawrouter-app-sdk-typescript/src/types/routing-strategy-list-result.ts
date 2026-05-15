import type { RoutingStrategySnapshot } from './routing-strategy-snapshot';

/** Routing strategy list result schema exposed by Claw Router. */
export interface RoutingStrategyListResult {
  /** Business response code. */
  code: string;
  /** Data field on routing strategy list result. */
  data?: RoutingStrategySnapshot;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
