import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Fulfillments list result schema exposed by Claw Router. */
export interface FulfillmentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on fulfillments list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
