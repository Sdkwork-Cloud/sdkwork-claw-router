import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Shipments tracking events list result schema exposed by Claw Router. */
export interface ShipmentsTrackingEventsListResult {
  /** Business response code. */
  code: string;
  /** Data field on shipments tracking events list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
