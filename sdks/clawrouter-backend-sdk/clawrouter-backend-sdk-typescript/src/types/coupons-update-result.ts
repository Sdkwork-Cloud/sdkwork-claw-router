import type { AdminCouponMutationResponse } from './admin-coupon-mutation-response';

/** Coupons update result schema exposed by Claw Router. */
export interface CouponsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons update result. */
  data?: AdminCouponMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
