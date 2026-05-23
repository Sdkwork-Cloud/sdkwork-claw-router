import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Refunds list result schema exposed by Claw Router. */
export interface RefundsListResult {
  /** Business response code. */
  code: string;
  /** Data field on refunds list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
