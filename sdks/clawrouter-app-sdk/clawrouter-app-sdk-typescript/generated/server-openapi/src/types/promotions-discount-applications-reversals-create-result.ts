import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions discount applications reversals create result schema exposed by Claw Router. */
export interface PromotionsDiscountApplicationsReversalsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount applications reversals create result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
