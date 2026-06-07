import type { CommercePaymentAttemptListResponse } from './commerce-payment-attempt-list-response';

/** Payments attempts list result schema exposed by Claw Router. */
export interface PaymentsAttemptsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments attempts list result. */
  data?: CommercePaymentAttemptListResponse;
  /** Human-readable response message. */
  msg?: string;
}
