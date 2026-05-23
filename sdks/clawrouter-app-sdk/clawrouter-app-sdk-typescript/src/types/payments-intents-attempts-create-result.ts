import type { CommercePaymentAttemptResponse } from './commerce-payment-attempt-response';

/** Payments intents attempts create result schema exposed by Claw Router. */
export interface PaymentsIntentsAttemptsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on payments intents attempts create result. */
  data?: CommercePaymentAttemptResponse;
  /** Human-readable response message. */
  msg?: string;
}
