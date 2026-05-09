import type { AdminCouponMutationResponse } from './admin-coupon-mutation-response';

export interface AddCouponResult {
  /** Business response code. */
  code: string;
  data?: AdminCouponMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
