import type { AdminAppDeleteResponse } from './admin-app-delete-response';

export interface DeleteAppResult {
  /** Business response code. */
  code: string;
  data?: AdminAppDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
