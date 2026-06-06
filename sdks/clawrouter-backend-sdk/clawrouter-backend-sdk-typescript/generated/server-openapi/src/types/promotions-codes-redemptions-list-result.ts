import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions codes redemptions list result schema exposed by Claw Router. */
export interface PromotionsCodesRedemptionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions codes redemptions list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
