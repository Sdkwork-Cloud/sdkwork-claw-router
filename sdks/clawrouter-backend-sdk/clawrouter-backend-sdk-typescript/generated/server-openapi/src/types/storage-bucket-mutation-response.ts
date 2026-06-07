import type { StorageBucketConfig } from './storage-bucket-config';

/** Storage bucket mutation response schema exposed by Claw Router. */
export interface StorageBucketMutationResponse {
  /** Bucket field on storage bucket mutation response. */
  bucket: StorageBucketConfig;
  /** Request id field on storage bucket mutation response. */
  requestId: string;
}
