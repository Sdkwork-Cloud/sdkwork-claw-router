import type { CommerceVipPointsHistoryResponse } from './commerce-vip-points-history-response';

/** Vip points history list result schema exposed by Claw Router. */
export interface VipPointsHistoryListResult {
  /** Business response code. */
  code: string;
  /** Data field on vip points history list result. */
  data?: CommerceVipPointsHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
