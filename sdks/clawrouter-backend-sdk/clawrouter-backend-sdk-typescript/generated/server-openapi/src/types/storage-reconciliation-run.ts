/** Storage reconciliation run schema exposed by Claw Router. */
export interface StorageReconciliationRun {
  /** Bucket id field on storage reconciliation run. */
  bucketId?: string;
  /** Bucket name field on storage reconciliation run. */
  bucketName?: string;
  /** Dry run field on storage reconciliation run. */
  dryRun?: boolean;
  /** Finished at field on storage reconciliation run. */
  finishedAt?: string;
  /** Id field on storage reconciliation run. */
  id: string;
  /** Issue count field on storage reconciliation run. */
  issueCount?: string;
  /** Issues field on storage reconciliation run. */
  issues?: string;
  /** Provider code field on storage reconciliation run. */
  providerCode?: string;
  /** Provider id field on storage reconciliation run. */
  providerId?: string;
  /** Run id field on storage reconciliation run. */
  runId: string;
  /** Run type field on storage reconciliation run. */
  runType?: string;
  /** Scope field on storage reconciliation run. */
  scope?: string;
  /** Started at field on storage reconciliation run. */
  startedAt?: string;
  /** Status field on storage reconciliation run. */
  status: 'canceled' | 'completed' | 'created' | 'failed' | 'running';
}
