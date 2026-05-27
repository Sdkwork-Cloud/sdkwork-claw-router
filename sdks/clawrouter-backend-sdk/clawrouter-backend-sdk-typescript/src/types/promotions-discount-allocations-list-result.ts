import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions discount allocations list result schema exposed by Claw Router. */
export interface PromotionsDiscountAllocationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions discount allocations list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
