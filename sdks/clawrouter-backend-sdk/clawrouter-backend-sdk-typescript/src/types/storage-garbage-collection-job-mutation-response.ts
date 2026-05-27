import type { StorageGarbageCollectionJob } from './storage-garbage-collection-job';

/** Storage garbage collection job mutation response schema exposed by Claw Router. */
export interface StorageGarbageCollectionJobMutationResponse {
  /** Job field on storage garbage collection job mutation response. */
  job: StorageGarbageCollectionJob;
  /** Request id field on storage garbage collection job mutation response. */
  requestId: string;
}
