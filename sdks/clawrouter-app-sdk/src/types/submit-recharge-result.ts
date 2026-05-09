import type { SubmitRechargeResponse } from './submit-recharge-response';

export interface SubmitRechargeResult {
  /** Business response code. */
  code: string;
  data?: SubmitRechargeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
