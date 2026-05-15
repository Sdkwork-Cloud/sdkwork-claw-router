import type { CommercePointsBalanceResponse } from './commerce-points-balance-response';

/** Vip points balance retrieve result schema exposed by Claw Router. */
export interface VipPointsBalanceRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip points balance retrieve result. */
  data?: CommercePointsBalanceResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
