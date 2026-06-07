import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions codes list result schema exposed by Claw Router. */
export interface PromotionsCodesListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions codes list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
