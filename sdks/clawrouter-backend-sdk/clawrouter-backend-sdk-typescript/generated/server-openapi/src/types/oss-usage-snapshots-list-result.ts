import type { StorageUsageSnapshotListResponse } from './storage-usage-snapshot-list-response';

/** Oss usage snapshots list result schema exposed by Claw Router. */
export interface OssUsageSnapshotsListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss usage snapshots list result. */
  data?: StorageUsageSnapshotListResponse;
  /** Human-readable response message. */
  msg?: string;
}
