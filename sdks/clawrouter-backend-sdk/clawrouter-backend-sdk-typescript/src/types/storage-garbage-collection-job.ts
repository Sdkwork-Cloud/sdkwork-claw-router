/** Storage garbage collection job schema exposed by Claw Router. */
export interface StorageGarbageCollectionJob {
  /** Candidate count field on storage garbage collection job. */
  candidateCount?: string;
  /** Created at field on storage garbage collection job. */
  createdAt?: string;
  /** Dry run field on storage garbage collection job. */
  dryRun?: boolean;
  /** Id field on storage garbage collection job. */
  id: string;
  /** Job id field on storage garbage collection job. */
  jobId: string;
  /** Job type field on storage garbage collection job. */
  jobType?: string;
  /** Retention field on storage garbage collection job. */
  retention?: string;
  /** Status field on storage garbage collection job. */
  status: 'canceled' | 'completed' | 'created' | 'failed' | 'running';
  /** Target field on storage garbage collection job. */
  target?: string;
}
