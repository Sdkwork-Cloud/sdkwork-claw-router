import type { StorageUsageCounterListResponse } from './storage-usage-counter-list-response';

/** Oss usage list result schema exposed by Claw Router. */
export interface OssUsageListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss usage list result. */
  data?: StorageUsageCounterListResponse;
  /** Human-readable response message. */
  msg?: string;
}
