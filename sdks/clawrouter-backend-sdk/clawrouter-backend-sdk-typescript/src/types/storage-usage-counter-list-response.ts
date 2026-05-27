import type { StorageUsageCounter } from './storage-usage-counter';

/** Storage usage counter list response schema exposed by Claw Router. */
export interface StorageUsageCounterListResponse {
  /** Items field on storage usage counter list response. */
  items: StorageUsageCounter[];
  /** Next cursor field on storage usage counter list response. */
  nextCursor?: string;
  /** Request id field on storage usage counter list response. */
  requestId: string;
}
