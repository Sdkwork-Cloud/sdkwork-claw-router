import type { AdminCouponMutationResponse } from './admin-coupon-mutation-response';

/** Coupons create result schema exposed by Claw Router. */
export interface CouponsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons create result. */
  data?: AdminCouponMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
