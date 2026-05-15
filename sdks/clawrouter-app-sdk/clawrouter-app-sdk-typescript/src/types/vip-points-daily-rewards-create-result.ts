import type { CommerceOperationResponse } from './commerce-operation-response';

/** Vip points daily rewards create result schema exposed by Claw Router. */
export interface VipPointsDailyRewardsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on vip points daily rewards create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
