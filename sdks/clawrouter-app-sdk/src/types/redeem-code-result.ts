import type { RedeemCodeResponse } from './redeem-code-response';

export interface RedeemCodeResult {
  /** Business response code. */
  code: string;
  data?: RedeemCodeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
