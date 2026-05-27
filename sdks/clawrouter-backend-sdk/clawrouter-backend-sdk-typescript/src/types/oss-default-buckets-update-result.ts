import type { StorageDefaultBucketMutationResponse } from './storage-default-bucket-mutation-response';

/** Oss default buckets update result schema exposed by Claw Router. */
export interface OssDefaultBucketsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss default buckets update result. */
  data?: StorageDefaultBucketMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
