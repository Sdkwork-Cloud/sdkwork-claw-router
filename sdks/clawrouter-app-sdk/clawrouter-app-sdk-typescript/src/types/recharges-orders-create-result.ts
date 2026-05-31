import type { CommerceRechargeOrderCreateResponse } from './commerce-recharge-order-create-response';

/** Recharges orders create result schema exposed by Claw Router. */
export interface RechargesOrdersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders create result. */
  data?: CommerceRechargeOrderCreateResponse;
  /** Human-readable response message. */
  msg?: string;
}
