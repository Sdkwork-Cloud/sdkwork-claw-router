import type { StorageDefaultBucketListResponse } from './storage-default-bucket-list-response';

/** Oss default buckets list result schema exposed by Claw Router. */
export interface OssDefaultBucketsListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss default buckets list result. */
  data?: StorageDefaultBucketListResponse;
  /** Human-readable response message. */
  msg?: string;
}
