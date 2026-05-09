import type { BillingRechargeHistoryResponse } from './billing-recharge-history-response';

export interface FetchRechargeHistoryResult {
  /** Business response code. */
  code: string;
  data?: BillingRechargeHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
