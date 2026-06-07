import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Commerce reports refunds list result schema exposed by Claw Router. */
export interface CommerceReportsRefundsListResult {
  /** Business response code. */
  code: string;
  /** Data field on commerce reports refunds list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
