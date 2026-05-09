import type { AccountSummaryResponse } from './account-summary-response';

export interface FetchAccountDetailsResult {
  /** Business response code. */
  code: string;
  data?: AccountSummaryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
