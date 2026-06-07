import type { StorageGarbageCollectionJobMutationResponse } from './storage-garbage-collection-job-mutation-response';

/** Oss gc jobs create result schema exposed by Claw Router. */
export interface OssGcJobsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss gc jobs create result. */
  data?: StorageGarbageCollectionJobMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
