import type { CheckoutStatusResponse } from './checkout-status-response';

/** Payments checkout retrieve result schema exposed by Claw Router. */
export interface PaymentsCheckoutRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on payments checkout retrieve result. */
  data?: CheckoutStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
