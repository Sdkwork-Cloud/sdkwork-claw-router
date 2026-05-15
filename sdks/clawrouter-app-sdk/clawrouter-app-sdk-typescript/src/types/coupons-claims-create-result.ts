import type { BillingRedeemHistoryItem } from './billing-redeem-history-item';

/** Coupons claims create result schema exposed by Claw Router. */
export interface CouponsClaimsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons claims create result. */
  data?: BillingRedeemHistoryItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
