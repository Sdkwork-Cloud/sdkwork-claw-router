import type { CommerceVipDailyRewardStatusResponse } from './commerce-vip-daily-reward-status-response';

/** Vip points daily rewards status retrieve result schema exposed by Claw Router. */
export interface VipPointsDailyRewardsStatusRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on vip points daily rewards status retrieve result. */
  data?: CommerceVipDailyRewardStatusResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
