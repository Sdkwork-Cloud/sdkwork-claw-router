import type { CommerceOperationResponse } from './commerce-operation-response';

/** Checkout sessions create result schema exposed by Claw Router. */
export interface CheckoutSessionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on checkout sessions create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
