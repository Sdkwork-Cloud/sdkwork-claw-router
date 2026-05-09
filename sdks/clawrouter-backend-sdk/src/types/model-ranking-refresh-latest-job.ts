export interface ModelRankingRefreshLatestJob {
  durationMs: number;
  endedAt: string;
  failureCount: number;
  failureReason: string | null;
  generatedCount: number;
  /** Stable job execution identifier from ops_job_execution. */
  id: string;
  /** Job name, expected to be model_ranking_refresh. */
  jobName: string;
  nextRefreshAt: string;
  organizationId: number;
  rankScope: string;
  snapshotDate: string;
  snapshotPeriod: string;
  sourceCount: number;
  startedAt: string;
  /** Latest matching ranking refresh job status. */
  status: 'succeeded' | 'failed' | 'empty' | 'skipped' | 'running';
  successCount: number;
  tenantId: number;
  windowEnd: string;
  windowStart: string;
}
