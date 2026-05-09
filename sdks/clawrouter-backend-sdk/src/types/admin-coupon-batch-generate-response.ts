import type { AdminCouponBatchItem } from './admin-coupon-batch-item';
import type { AdminPromoCodeItem } from './admin-promo-code-item';

export interface AdminCouponBatchGenerateResponse {
  batch: AdminCouponBatchItem;
  /** Generated promo code snapshots returned by the backend. */
  codes: AdminPromoCodeItem[];
}
