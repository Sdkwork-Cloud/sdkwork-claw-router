import type { AdminDeleteResponse } from './admin-delete-response';

/** Coupons delete result schema exposed by Claw Router. */
export interface CouponsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
