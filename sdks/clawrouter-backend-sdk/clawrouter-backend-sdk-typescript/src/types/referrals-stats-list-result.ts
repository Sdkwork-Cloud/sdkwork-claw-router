import type { AdminReferralStatsResponse } from './admin-referral-stats-response';

/** Referrals stats list result schema exposed by Claw Router. */
export interface ReferralsStatsListResult {
  /** Business response code. */
  code: string;
  /** Data field on referrals stats list result. */
  data?: AdminReferralStatsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
