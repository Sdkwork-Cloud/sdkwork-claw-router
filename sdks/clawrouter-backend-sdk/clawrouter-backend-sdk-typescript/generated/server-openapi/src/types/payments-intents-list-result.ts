import type { CommercePaymentIntentListResponse } from './commerce-payment-intent-list-response';

/** Payments intents list result schema exposed by Claw Router. */
export interface PaymentsIntentsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments intents list result. */
  data?: CommercePaymentIntentListResponse;
  /** Human-readable response message. */
  msg?: string;
}
