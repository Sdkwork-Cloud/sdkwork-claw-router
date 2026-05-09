import type { OpsReferralStatSnapshotRecord } from './ops-referral-stat-snapshot-record';

export interface FetchReferralStatsResult {
  /** Business response code. */
  code: string;
  data?: OpsReferralStatSnapshotRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
