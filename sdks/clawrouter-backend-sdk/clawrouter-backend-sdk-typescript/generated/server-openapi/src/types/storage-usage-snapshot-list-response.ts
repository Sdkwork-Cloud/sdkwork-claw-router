import type { StorageUsageSnapshot } from './storage-usage-snapshot';

/** Storage usage snapshot list response schema exposed by Claw Router. */
export interface StorageUsageSnapshotListResponse {
  /** Items field on storage usage snapshot list response. */
  items: StorageUsageSnapshot[];
  /** Next cursor field on storage usage snapshot list response. */
  nextCursor?: string;
  /** Request id field on storage usage snapshot list response. */
  requestId: string;
}
