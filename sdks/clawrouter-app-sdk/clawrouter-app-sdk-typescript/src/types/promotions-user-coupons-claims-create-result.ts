import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions user coupons claims create result schema exposed by Claw Router. */
export interface PromotionsUserCouponsClaimsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions user coupons claims create result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
