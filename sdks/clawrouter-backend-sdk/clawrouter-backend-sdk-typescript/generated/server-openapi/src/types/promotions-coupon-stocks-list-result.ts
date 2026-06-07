import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions coupon stocks list result schema exposed by Claw Router. */
export interface PromotionsCouponStocksListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions coupon stocks list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
