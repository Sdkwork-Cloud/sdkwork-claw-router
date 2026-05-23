import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Coupons redemptions list result schema exposed by Claw Router. */
export interface CouponsRedemptionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons redemptions list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
