import type { CommerceOperationResponse } from './commerce-operation-response';

/** Checkout sessions quotes create result schema exposed by Claw Router. */
export interface CheckoutSessionsQuotesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on checkout sessions quotes create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
