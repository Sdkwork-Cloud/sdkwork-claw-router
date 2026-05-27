import type { PromotionCouponWalletItem } from './promotion-coupon-wallet-item';

/** Promotion user coupon wallet list response schema exposed by Claw Router. */
export interface PromotionUserCouponWalletListResponse {
  /** Items field on promotion user coupon wallet list response. */
  items: PromotionCouponWalletItem[];
}
