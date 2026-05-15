/** Model ranking refresh trigger request schema exposed by Claw Router. */
export interface ModelRankingRefreshTriggerRequest {
  /** Cache freshness contract for ranking readers after this refresh. */
  cacheMaxAgeSeconds?: number;
  /** Maximum ranking rows to generate. */
  limit?: number;
  /** Source usage lookback window in days. */
  lookbackDays?: number;
  /** Ranking scope to regenerate. Defaults to commercial-default. */
  rankScope?: string;
  /** Planned interval used for audit metadata and next refresh time. */
  refreshIntervalSeconds?: number;
  /** Snapshot granularity used by the ranking worker. */
  snapshotPeriod?: 'hourly' | 'daily' | 'weekly' | 'monthly';
}
