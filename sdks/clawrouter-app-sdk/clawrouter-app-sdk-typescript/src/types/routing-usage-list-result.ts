import type { RoutingUsageSnapshot } from './routing-usage-snapshot';

/** Routing usage list result schema exposed by Claw Router. */
export interface RoutingUsageListResult {
  /** Business response code. */
  code: string;
  /** Data field on routing usage list result. */
  data?: RoutingUsageSnapshot;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
