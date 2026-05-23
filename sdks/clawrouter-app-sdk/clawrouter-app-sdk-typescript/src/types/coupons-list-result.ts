import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Coupons list result schema exposed by Claw Router. */
export interface CouponsListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
