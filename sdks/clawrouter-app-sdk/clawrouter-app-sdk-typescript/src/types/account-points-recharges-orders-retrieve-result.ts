import type { CheckoutStatusResponse } from './checkout-status-response';

/** Account points recharges orders retrieve result schema exposed by Claw Router. */
export interface AccountPointsRechargesOrdersRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account points recharges orders retrieve result. */
  data?: CheckoutStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
