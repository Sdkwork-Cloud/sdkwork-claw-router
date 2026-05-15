import type { AdminBillingRecordsResponse } from './admin-billing-records-response';

/** Finance usage statements list result schema exposed by Claw Router. */
export interface FinanceUsageStatementsListResult {
  /** Business response code. */
  code: string;
  /** Data field on finance usage statements list result. */
  data?: AdminBillingRecordsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
