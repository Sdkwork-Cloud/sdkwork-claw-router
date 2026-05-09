import type { BillingRedeemHistoryResponse } from './billing-redeem-history-response';

export interface FetchRedeemHistoryResult {
  /** Business response code. */
  code: string;
  data?: BillingRedeemHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
