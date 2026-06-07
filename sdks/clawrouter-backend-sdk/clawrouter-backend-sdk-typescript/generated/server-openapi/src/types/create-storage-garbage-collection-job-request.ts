import type { JsonValue } from './json-value';

/** Create storage garbage collection job request schema exposed by Claw Router. */
export interface CreateStorageGarbageCollectionJobRequest {
  /** Criteria field on create storage garbage collection job request. */
  criteria?: Record<string, JsonValue>;
  /** Dry run field on create storage garbage collection job request. */
  dryRun: boolean;
  /** Dry run sample field on create storage garbage collection job request. */
  dryRunSample?: string;
  /** Job type field on create storage garbage collection job request. */
  jobType: string;
  /** Retention window field on create storage garbage collection job request. */
  retentionWindow?: string;
  /** Target field on create storage garbage collection job request. */
  target?: string;
}
