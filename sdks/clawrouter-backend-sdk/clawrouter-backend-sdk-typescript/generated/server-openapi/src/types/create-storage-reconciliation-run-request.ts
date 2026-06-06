/** Create storage reconciliation run request schema exposed by Claw Router. */
export interface CreateStorageReconciliationRunRequest {
  /** Bucket id field on create storage reconciliation run request. */
  bucketId?: string;
  /** Check mode field on create storage reconciliation run request. */
  checkMode?: string;
  /** Dry run field on create storage reconciliation run request. */
  dryRun: boolean;
  /** Provider id field on create storage reconciliation run request. */
  providerId?: string;
  /** Reason field on create storage reconciliation run request. */
  reason?: string;
  /** Run type field on create storage reconciliation run request. */
  runType: string;
}
