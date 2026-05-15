import type { BillingRechargeHistoryResponse } from './billing-recharge-history-response';

/** Payments records list result schema exposed by Claw Router. */
export interface PaymentsRecordsListResult {
  /** Business response code. */
  code: string;
  /** Data field on payments records list result. */
  data?: BillingRechargeHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
