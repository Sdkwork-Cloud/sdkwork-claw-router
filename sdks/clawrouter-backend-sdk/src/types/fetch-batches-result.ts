import type { OpsCouponIssueBatchRecord } from './ops-coupon-issue-batch-record';

export interface FetchBatchesResult {
  /** Business response code. */
  code: string;
  data?: OpsCouponIssueBatchRecord[];
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
