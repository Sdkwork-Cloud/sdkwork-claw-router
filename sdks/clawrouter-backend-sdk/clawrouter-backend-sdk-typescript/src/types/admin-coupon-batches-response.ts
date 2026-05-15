import type { AdminCouponBatchItem } from './admin-coupon-batch-item';

/** Admin coupon batches response schema exposed by Claw Router. */
export interface AdminCouponBatchesResponse {
  /** Items field on admin coupon batches response. */
  items: AdminCouponBatchItem[];
}
