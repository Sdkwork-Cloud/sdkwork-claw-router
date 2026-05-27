import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions offers management list result schema exposed by Claw Router. */
export interface PromotionsOffersManagementListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions offers management list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
