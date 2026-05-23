import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Fulfillments retrieve result schema exposed by Claw Router. */
export interface FulfillmentsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on fulfillments retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
