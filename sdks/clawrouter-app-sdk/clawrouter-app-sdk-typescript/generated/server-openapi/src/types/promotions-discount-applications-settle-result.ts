import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions discount applications settle result schema exposed by Claw Router. */
export interface PromotionsDiscountApplicationsSettleResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount applications settle result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
