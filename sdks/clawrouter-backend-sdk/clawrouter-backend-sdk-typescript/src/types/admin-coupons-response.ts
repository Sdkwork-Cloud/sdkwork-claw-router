import type { AdminCouponItem } from './admin-coupon-item';

/** Admin coupons response schema exposed by Claw Router. */
export interface AdminCouponsResponse {
  /** Items field on admin coupons response. */
  items: AdminCouponItem[];
}
