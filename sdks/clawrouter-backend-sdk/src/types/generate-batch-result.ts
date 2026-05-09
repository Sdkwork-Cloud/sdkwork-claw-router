import type { AdminCouponBatchGenerateResponse } from './admin-coupon-batch-generate-response';

export interface GenerateBatchResult {
  /** Business response code. */
  code: string;
  data?: AdminCouponBatchGenerateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
