import type { AdminCouponBatchesResponse } from './admin-coupon-batches-response';

/** Coupon batches list result schema exposed by Claw Router. */
export interface CouponBatchesListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupon batches list result. */
  data?: AdminCouponBatchesResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
