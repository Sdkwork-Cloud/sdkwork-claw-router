import type { PromotionUserCouponWalletListResponse } from './promotion-user-coupon-wallet-list-response';

/** Promotions user coupons wallet list result schema exposed by Claw Router. */
export interface PromotionsUserCouponsWalletListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions user coupons wallet list result. */
  data?: PromotionUserCouponWalletListResponse;
  /** Human-readable response message. */
  msg?: string;
}
