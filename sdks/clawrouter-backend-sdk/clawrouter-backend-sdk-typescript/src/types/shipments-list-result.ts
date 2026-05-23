import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Shipments list result schema exposed by Claw Router. */
export interface ShipmentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on shipments list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
