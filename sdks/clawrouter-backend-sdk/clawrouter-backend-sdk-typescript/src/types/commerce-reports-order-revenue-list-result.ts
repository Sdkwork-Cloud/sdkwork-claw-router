import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Commerce reports order revenue list result schema exposed by Claw Router. */
export interface CommerceReportsOrderRevenueListResult {
  /** Business response code. */
  code: string;
  /** Data field on commerce reports order revenue list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
