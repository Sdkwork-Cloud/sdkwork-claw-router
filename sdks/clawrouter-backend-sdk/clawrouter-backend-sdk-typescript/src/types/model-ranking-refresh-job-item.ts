/** Model ranking refresh job item schema exposed by Claw Router. */
export interface ModelRankingRefreshJobItem {
  /** Duration ms field on model ranking refresh job item. */
  durationMs: number;
  /** Ended at field on model ranking refresh job item. */
  endedAt: string;
  /** Failure count field on model ranking refresh job item. */
  failureCount: number;
  /** Failure reason field on model ranking refresh job item. */
  failureReason: string | null;
  /** Generated count field on model ranking refresh job item. */
  generatedCount: number;
  /** Stable job execution identifier from ops_job_execution. */
  id: string;
  /** Job name, expected to be model_ranking_refresh. */
  jobName: string;
  /** Next refresh at field on model ranking refresh job item. */
  nextRefreshAt: string;
  /** Organization id field on model ranking refresh job item. */
  organizationId: number;
  /** Rank scope field on model ranking refresh job item. */
  rankScope: string;
  /** Snapshot date field on model ranking refresh job item. */
  snapshotDate: string;
  /** Snapshot period field on model ranking refresh job item. */
  snapshotPeriod: string;
  /** Source count field on model ranking refresh job item. */
  sourceCount: number;
  /** Started at field on model ranking refresh job item. */
  startedAt: string;
  /** Normalized execution status for operator diagnostics. */
  status: 'succeeded' | 'failed' | 'empty' | 'skipped' | 'running';
  /** Success count field on model ranking refresh job item. */
  successCount: number;
  /** Tenant id field on model ranking refresh job item. */
  tenantId: number;
  /** Window end field on model ranking refresh job item. */
  windowEnd: string;
  /** Window start field on model ranking refresh job item. */
  windowStart: string;
}
