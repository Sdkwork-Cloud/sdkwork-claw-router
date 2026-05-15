import type { CommercePointsHistoryResponse } from './commerce-points-history-response';

/** Account points history list result schema exposed by Claw Router. */
export interface AccountPointsHistoryListResult {
  /** Business response code. */
  code: string;
  /** Data field on account points history list result. */
  data?: CommercePointsHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
