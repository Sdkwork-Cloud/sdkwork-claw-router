import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions codes redemptions create result schema exposed by Claw Router. */
export interface PromotionsCodesRedemptionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions codes redemptions create result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
