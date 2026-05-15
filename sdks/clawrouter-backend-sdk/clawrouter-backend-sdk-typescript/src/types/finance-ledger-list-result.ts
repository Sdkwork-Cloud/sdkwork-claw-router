import type { AdminTransactionsResponse } from './admin-transactions-response';

/** Finance ledger list result schema exposed by Claw Router. */
export interface FinanceLedgerListResult {
  /** Business response code. */
  code: string;
  /** Data field on finance ledger list result. */
  data?: AdminTransactionsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
