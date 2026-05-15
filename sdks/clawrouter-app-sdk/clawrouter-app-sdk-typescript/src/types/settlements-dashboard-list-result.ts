import type { SettlementDashboardResponse } from './settlement-dashboard-response';

/** Settlements dashboard list result schema exposed by Claw Router. */
export interface SettlementsDashboardListResult {
  /** Business response code. */
  code: string;
  /** Data field on settlements dashboard list result. */
  data?: SettlementDashboardResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
