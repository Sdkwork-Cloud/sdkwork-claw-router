import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Orders events list result schema exposed by Claw Router. */
export interface OrdersEventsListResult {
  /** Business response code. */
  code: string;
  /** Data field on orders events list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
