import type { StorageReconciliationRunListResponse } from './storage-reconciliation-run-list-response';

/** Oss reconciliation runs list result schema exposed by Claw Router. */
export interface OssReconciliationRunsListResult {
  /** Business response code. */
  code: string;
  /** Data field on oss reconciliation runs list result. */
  data?: StorageReconciliationRunListResponse;
  /** Human-readable response message. */
  msg?: string;
}
