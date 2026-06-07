import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Audit commerce events list result schema exposed by Claw Router. */
export interface AuditCommerceEventsListResult {
  /** Business response code. */
  code: string;
  /** Data field on audit commerce events list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
