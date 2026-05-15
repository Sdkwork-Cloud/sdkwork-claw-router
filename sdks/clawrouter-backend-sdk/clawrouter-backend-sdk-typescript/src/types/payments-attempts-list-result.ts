import type { AdminPaymentAttemptsResponse } from './admin-payment-attempts-response';

/** Payments attempts list result schema exposed by Claw Router. */
export interface PaymentsAttemptsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments attempts list result. */
  data?: AdminPaymentAttemptsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
