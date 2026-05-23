import type { CommercePaymentIntentResponse } from './commerce-payment-intent-response';

/** Payments intents retrieve result schema exposed by Claw Router. */
export interface PaymentsIntentsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on payments intents retrieve result. */
  data?: CommercePaymentIntentResponse;
  /** Human-readable response message. */
  msg?: string;
}
