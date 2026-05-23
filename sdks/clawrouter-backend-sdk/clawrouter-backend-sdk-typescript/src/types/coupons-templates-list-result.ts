import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Coupons templates list result schema exposed by Claw Router. */
export interface CouponsTemplatesListResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons templates list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
