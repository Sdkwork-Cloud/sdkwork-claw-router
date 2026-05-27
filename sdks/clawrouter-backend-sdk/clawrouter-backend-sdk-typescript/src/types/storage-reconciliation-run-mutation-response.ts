import type { StorageReconciliationRun } from './storage-reconciliation-run';

/** Storage reconciliation run mutation response schema exposed by Claw Router. */
export interface StorageReconciliationRunMutationResponse {
  /** Reconciliation run field on storage reconciliation run mutation response. */
  reconciliationRun: StorageReconciliationRun;
  /** Request id field on storage reconciliation run mutation response. */
  requestId: string;
}
