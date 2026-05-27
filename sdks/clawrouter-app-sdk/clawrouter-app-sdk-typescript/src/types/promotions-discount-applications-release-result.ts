import type { PromotionOperationResponse } from './promotion-operation-response';

/** Promotions discount applications release result schema exposed by Claw Router. */
export interface PromotionsDiscountApplicationsReleaseResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount applications release result. */
  data?: PromotionOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
