import type { CommerceOperationResponse } from './commerce-operation-response';

/** Checkout sessions orders create result schema exposed by Claw Router. */
export interface CheckoutSessionsOrdersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on checkout sessions orders create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
