import type { StorageDefaultBucketConfig } from './storage-default-bucket-config';

/** Storage default bucket mutation response schema exposed by Claw Router. */
export interface StorageDefaultBucketMutationResponse {
  /** Default bucket field on storage default bucket mutation response. */
  defaultBucket: StorageDefaultBucketConfig;
  /** Request id field on storage default bucket mutation response. */
  requestId: string;
}
