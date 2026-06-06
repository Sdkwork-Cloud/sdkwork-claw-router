import type { StorageGarbageCollectionJobListResponse } from './storage-garbage-collection-job-list-response';

/** Oss gc jobs list result schema exposed by Claw Router. */
export interface OssGcJobsListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss gc jobs list result. */
  data?: StorageGarbageCollectionJobListResponse;
  /** Human-readable response message. */
  msg?: string;
}
