import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions events list result schema exposed by Claw Router. */
export interface PromotionsEventsListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions events list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
