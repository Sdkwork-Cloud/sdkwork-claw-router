import type { AdminCouponBatchGenerateResponse } from './admin-coupon-batch-generate-response';

/** Coupon batches create result schema exposed by Claw Router. */
export interface CouponBatchesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupon batches create result. */
  data?: AdminCouponBatchGenerateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
