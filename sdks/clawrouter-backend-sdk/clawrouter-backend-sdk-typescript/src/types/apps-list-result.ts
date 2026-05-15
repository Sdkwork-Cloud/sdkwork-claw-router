import type { AdminAppListResponse } from './admin-app-list-response';

/** Apps list result schema exposed by Claw Router. */
export interface AppsListResult {
  /** Business response code. */
  code: string;
  /** Data field on apps list result. */
  data?: AdminAppListResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
