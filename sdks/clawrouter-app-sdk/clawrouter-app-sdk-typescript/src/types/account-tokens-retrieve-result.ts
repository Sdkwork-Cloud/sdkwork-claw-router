import type { CommerceTokenBalanceResponse } from './commerce-token-balance-response';

/** Account tokens retrieve result schema exposed by Claw Router. */
export interface AccountTokensRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account tokens retrieve result. */
  data?: CommerceTokenBalanceResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
