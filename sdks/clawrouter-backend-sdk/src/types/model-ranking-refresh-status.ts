import type { ModelRankingRefreshLatestJob } from './model-ranking-refresh-latest-job';

export interface ModelRankingRefreshStatus {
  /** Maximum cache age clients and services should use for this status snapshot. */
  cacheMaxAgeSeconds: number;
  /** Time when the ranking snapshot was generated. */
  generatedAt: string;
  /** Number of ranking rows generated in the selected snapshot. */
  generatedCount: number;
  latestJob: ModelRankingRefreshLatestJob | null;
  /** Planned next refresh time. */
  nextRefreshAt: string;
  /** Organization scope used by the selected ranking snapshot. */
  organizationId: number;
  /** Ranking scope, for example commercial-default. */
  rankScope: string;
  /** Planned refresh interval used by the ranking task. */
  refreshIntervalSeconds: number;
  /** Snapshot business date for the latest visible ranking. */
  snapshotDate: string;
  /** Snapshot period granularity, for example daily. */
  snapshotPeriod: string;
  /** Number of source usage rows represented by the selected snapshot. */
  sourceCount: number;
  sourceTables: string[];
  /** Published ranking read-model status for the latest visible snapshot. */
  status: 'ready' | 'empty' | 'unavailable';
  /** Tenant scope used by the selected ranking snapshot. */
  tenantId: number;
  /** Exclusive source aggregation window end. */
  windowEnd: string;
  /** Inclusive source aggregation window start. */
  windowStart: string;
}
