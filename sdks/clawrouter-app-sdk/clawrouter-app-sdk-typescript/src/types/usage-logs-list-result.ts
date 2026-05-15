import type { UsageLogsResponse } from './usage-logs-response';

/** Usage logs list result schema exposed by Claw Router. */
export interface UsageLogsListResult {
  /** Business response code. */
  code: string;
  /** Data field on usage logs list result. */
  data?: UsageLogsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
