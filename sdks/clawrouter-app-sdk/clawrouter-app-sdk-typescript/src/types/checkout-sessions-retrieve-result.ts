import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Checkout sessions retrieve result schema exposed by Claw Router. */
export interface CheckoutSessionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on checkout sessions retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
