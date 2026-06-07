import type { StorageBucketConfig } from './storage-bucket-config';

/** Storage bucket list response schema exposed by Claw Router. */
export interface StorageBucketListResponse {
  /** Items field on storage bucket list response. */
  items: StorageBucketConfig[];
  /** Next cursor field on storage bucket list response. */
  nextCursor?: string;
  /** Request id field on storage bucket list response. */
  requestId: string;
}
