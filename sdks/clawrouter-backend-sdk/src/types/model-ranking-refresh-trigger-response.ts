export interface ModelRankingRefreshTriggerResponse {
  cacheMaxAgeSeconds: number;
  generatedCount: number;
  nextRefreshAt: string;
  organizationId: number;
  rankScope: string;
  refreshIntervalSeconds: number;
  snapshotDate: string;
  snapshotPeriod: 'hourly' | 'daily' | 'weekly' | 'monthly';
  sourceCount: number;
  /** Result of the manual ranking worker run. */
  status: 'succeeded' | 'empty';
  tenantId: number;
  /** Whether a manual refresh worker run was started. */
  triggered: boolean;
  windowEnd: string;
  windowStart: string;
}
