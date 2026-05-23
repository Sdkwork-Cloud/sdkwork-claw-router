import type { CommercePaymentIntentResponse } from './commerce-payment-intent-response';

/** Payments intents create result schema exposed by Claw Router. */
export interface PaymentsIntentsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on payments intents create result. */
  data?: CommercePaymentIntentResponse;
  /** Human-readable response message. */
  msg?: string;
}
