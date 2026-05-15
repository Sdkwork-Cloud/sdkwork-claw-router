import type { RedeemCodeResponse } from './redeem-code-response';

/** Coupons redeem create result schema exposed by Claw Router. */
export interface CouponsRedeemCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons redeem create result. */
  data?: RedeemCodeResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
