import type { AdminPromoCodesResponse } from './admin-promo-codes-response';

/** Coupon codes list result schema exposed by Claw Router. */
export interface CouponCodesListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupon codes list result. */
  data?: AdminPromoCodesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
