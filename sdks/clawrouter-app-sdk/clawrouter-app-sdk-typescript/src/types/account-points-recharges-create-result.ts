import type { SubmitRechargeResponse } from './submit-recharge-response';

/** Account points recharges create result schema exposed by Claw Router. */
export interface AccountPointsRechargesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on account points recharges create result. */
  data?: SubmitRechargeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
