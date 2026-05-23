import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Coupons campaigns list result schema exposed by Claw Router. */
export interface CouponsCampaignsListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons campaigns list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
