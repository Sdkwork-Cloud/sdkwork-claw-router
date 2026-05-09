import type { SettlementDashboardResponse } from './settlement-dashboard-response';

export interface FetchDashboardDataResult {
  /** Business response code. */
  code: string;
  data?: SettlementDashboardResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
