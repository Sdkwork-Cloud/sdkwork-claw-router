import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions discount applications list result schema exposed by Claw Router. */
export interface PromotionsDiscountApplicationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount applications list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
