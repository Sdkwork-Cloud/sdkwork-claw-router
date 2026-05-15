import type { AdminCouponBatchItem } from './admin-coupon-batch-item';
import type { AdminPromoCodeItem } from './admin-promo-code-item';

/** Admin coupon batch generate response schema exposed by Claw Router. */
export interface AdminCouponBatchGenerateResponse {
  /** Batch field on admin coupon batch generate response. */
  batch: AdminCouponBatchItem;
  /** Generated promo code snapshots returned by the backend. */
  codes: AdminPromoCodeItem[];
}
