import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions user coupons management list result schema exposed by Claw Router. */
export interface PromotionsUserCouponsManagementListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions user coupons management list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
