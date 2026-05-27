import type { StorageReconciliationRun } from './storage-reconciliation-run';

/** Storage reconciliation run list response schema exposed by Claw Router. */
export interface StorageReconciliationRunListResponse {
  /** Items field on storage reconciliation run list response. */
  items: StorageReconciliationRun[];
  /** Next cursor field on storage reconciliation run list response. */
  nextCursor?: string;
  /** Request id field on storage reconciliation run list response. */
  requestId: string;
}
