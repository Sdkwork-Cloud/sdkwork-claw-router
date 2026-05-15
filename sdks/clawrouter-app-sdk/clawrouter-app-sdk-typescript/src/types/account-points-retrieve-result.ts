import type { CommercePointsBalanceResponse } from './commerce-points-balance-response';

/** Account points retrieve result schema exposed by Claw Router. */
export interface AccountPointsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account points retrieve result. */
  data?: CommercePointsBalanceResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
