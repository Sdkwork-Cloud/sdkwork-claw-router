import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Recharges orders list result schema exposed by Claw Router. */
export interface RechargesOrdersListResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
