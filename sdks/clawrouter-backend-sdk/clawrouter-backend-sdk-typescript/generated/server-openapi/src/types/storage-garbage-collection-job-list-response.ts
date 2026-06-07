import type { StorageGarbageCollectionJob } from './storage-garbage-collection-job';

/** Storage garbage collection job list response schema exposed by Claw Router. */
export interface StorageGarbageCollectionJobListResponse {
  /** Items field on storage garbage collection job list response. */
  items: StorageGarbageCollectionJob[];
  /** Next cursor field on storage garbage collection job list response. */
  nextCursor?: string;
  /** Request id field on storage garbage collection job list response. */
  requestId: string;
}
