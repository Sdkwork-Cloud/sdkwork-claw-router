import type { BillingRedeemHistoryResponse } from './billing-redeem-history-response';

/** Users current coupons list result schema exposed by Claw Router. */
export interface UsersCurrentCouponsListResult {
  /** Business response code. */
  code: string;
  /** Data field on users current coupons list result. */
  data?: BillingRedeemHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
