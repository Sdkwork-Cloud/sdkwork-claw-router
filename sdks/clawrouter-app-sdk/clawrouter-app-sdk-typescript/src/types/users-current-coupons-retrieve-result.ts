import type { BillingRedeemHistoryItem } from './billing-redeem-history-item';

/** Users current coupons retrieve result schema exposed by Claw Router. */
export interface UsersCurrentCouponsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on users current coupons retrieve result. */
  data?: BillingRedeemHistoryItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
