import type { AdminDeleteResponse } from './admin-delete-response';

/** Recharges packages delete result schema exposed by Claw Router. */
export interface RechargesPackagesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges packages delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
