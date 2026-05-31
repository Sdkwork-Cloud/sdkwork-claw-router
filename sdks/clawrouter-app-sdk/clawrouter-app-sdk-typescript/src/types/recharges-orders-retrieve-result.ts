import type { CommerceRechargeCheckoutStatusResponse } from './commerce-recharge-checkout-status-response';

/** Recharges orders retrieve result schema exposed by Claw Router. */
export interface RechargesOrdersRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders retrieve result. */
  data?: CommerceRechargeCheckoutStatusResponse;
  /** Human-readable response message. */
  msg?: string;
}
