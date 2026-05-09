export interface ModelRankingsSource {
  cacheMaxAgeSeconds: number;
  generatedAt: string;
  nextRefreshAt: string;
  observedAt: string;
  rankScope: string;
  refreshIntervalSeconds: number;
  snapshotDate: string;
  snapshotPeriod: string;
  sourceDescription: string;
  sourceLabel: string;
  sourceTables: string[];
  windowEnd: string;
  windowStart: string;
}
