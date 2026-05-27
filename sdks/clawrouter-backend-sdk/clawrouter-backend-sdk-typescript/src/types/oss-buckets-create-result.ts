import type { StorageBucketMutationResponse } from './storage-bucket-mutation-response';

/** Oss buckets create result schema exposed by Claw Router. */
export interface OssBucketsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss buckets create result. */
  data?: StorageBucketMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
