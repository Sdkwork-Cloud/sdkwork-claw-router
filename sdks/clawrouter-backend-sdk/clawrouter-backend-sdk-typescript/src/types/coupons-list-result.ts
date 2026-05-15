import type { AdminCouponsResponse } from './admin-coupons-response';

/** Coupons list result schema exposed by Claw Router. */
export interface CouponsListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons list result. */
  data?: AdminCouponsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
