import type { BillingRechargeHistoryItem } from './billing-recharge-history-item';

/** Payments records retrieve result schema exposed by Claw Router. */
export interface PaymentsRecordsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on payments records retrieve result. */
  data?: BillingRechargeHistoryItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
