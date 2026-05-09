import type { DashboardOverviewResponse } from './dashboard-overview-response';

export interface FetchDashboardOverviewResult {
  /** Business response code. */
  code: string;
  data?: DashboardOverviewResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
