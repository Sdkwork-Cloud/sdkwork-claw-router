import type { AdminAppDeleteResponse } from './admin-app-delete-response';

/** Apps delete result schema exposed by Claw Router. */
export interface AppsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on apps delete result. */
  data?: AdminAppDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
