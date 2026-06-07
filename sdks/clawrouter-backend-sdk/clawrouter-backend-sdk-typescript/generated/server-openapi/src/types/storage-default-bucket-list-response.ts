import type { StorageDefaultBucketConfig } from './storage-default-bucket-config';

/** Storage default bucket list response schema exposed by Claw Router. */
export interface StorageDefaultBucketListResponse {
  /** Items field on storage default bucket list response. */
  items: StorageDefaultBucketConfig[];
  /** Request id field on storage default bucket list response. */
  requestId: string;
}
