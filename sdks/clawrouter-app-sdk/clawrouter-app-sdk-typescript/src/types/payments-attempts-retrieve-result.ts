import type { CommercePaymentAttemptResponse } from './commerce-payment-attempt-response';

/** Payments attempts retrieve result schema exposed by Claw Router. */
export interface PaymentsAttemptsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on payments attempts retrieve result. */
  data?: CommercePaymentAttemptResponse;
  /** Human-readable response message. */
  msg?: string;
}
