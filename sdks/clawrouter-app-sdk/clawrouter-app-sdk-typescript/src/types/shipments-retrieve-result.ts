import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Shipments retrieve result schema exposed by Claw Router. */
export interface ShipmentsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on shipments retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
