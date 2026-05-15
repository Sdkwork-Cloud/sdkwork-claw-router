import type { AccountSummaryResponse } from './account-summary-response';

/** Account summary retrieve result schema exposed by Claw Router. */
export interface AccountSummaryRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account summary retrieve result. */
  data?: AccountSummaryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
