import type { UsageLogsResponse } from './usage-logs-response';

export interface FetchLogsResult {
  /** Business response code. */
  code: string;
  data?: UsageLogsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
