import type { PromotionCollectionResponse } from './promotion-collection-response';

/** Promotions coupon ledger entries list result schema exposed by Claw Router. */
export interface PromotionsCouponLedgerEntriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on promotions coupon ledger entries list result. */
  data?: PromotionCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
