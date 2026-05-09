import type { RoutingUsageSnapshot } from './routing-usage-snapshot';

export interface FetchUsageDataResult {
  /** Business response code. */
  code: string;
  data?: RoutingUsageSnapshot;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
