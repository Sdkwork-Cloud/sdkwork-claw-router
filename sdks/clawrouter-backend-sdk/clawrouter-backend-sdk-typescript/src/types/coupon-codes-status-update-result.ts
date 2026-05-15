import type { AdminPromoCodeStatusUpdateResponse } from './admin-promo-code-status-update-response';

/** Coupon codes status update result schema exposed by Claw Router. */
export interface CouponCodesStatusUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupon codes status update result. */
  data?: AdminPromoCodeStatusUpdateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
