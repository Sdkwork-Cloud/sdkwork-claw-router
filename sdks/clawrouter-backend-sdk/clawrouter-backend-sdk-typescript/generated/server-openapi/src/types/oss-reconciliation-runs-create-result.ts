import type { StorageReconciliationRunMutationResponse } from './storage-reconciliation-run-mutation-response';

/** Oss reconciliation runs create result schema exposed by Claw Router. */
export interface OssReconciliationRunsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oss reconciliation runs create result. */
  data?: StorageReconciliationRunMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
