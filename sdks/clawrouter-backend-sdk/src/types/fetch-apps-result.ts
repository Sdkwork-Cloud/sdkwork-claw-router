import type { AdminAppListResponse } from './admin-app-list-response';

export interface FetchAppsResult {
  /** Business response code. */
  code: string;
  data?: AdminAppListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
