import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions discount applications create result schema exposed by Claw Router. */
export interface PromotionsDiscountApplicationsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount applications create result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
