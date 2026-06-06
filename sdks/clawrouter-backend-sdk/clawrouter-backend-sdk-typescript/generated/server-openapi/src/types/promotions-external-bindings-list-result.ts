import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions external bindings list result schema exposed by Claw Router. */
export interface PromotionsExternalBindingsListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions external bindings list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
