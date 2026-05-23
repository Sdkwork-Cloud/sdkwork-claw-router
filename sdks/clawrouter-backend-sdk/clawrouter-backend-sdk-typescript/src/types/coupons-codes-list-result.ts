import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Coupons codes list result schema exposed by Claw Router. */
export interface CouponsCodesListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons codes list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
