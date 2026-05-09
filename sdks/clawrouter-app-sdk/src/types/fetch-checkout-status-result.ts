import type { CheckoutStatusResponse } from './checkout-status-response';

export interface FetchCheckoutStatusResult {
  /** Business response code. */
  code: string;
  data?: CheckoutStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
