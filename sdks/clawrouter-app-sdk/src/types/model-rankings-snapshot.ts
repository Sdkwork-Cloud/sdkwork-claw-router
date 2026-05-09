import type { ModelRankingHistoryPoint } from './model-ranking-history-point';
import type { ModelRankingItem } from './model-ranking-item';
import type { ModelRankingsSource } from './model-rankings-source';

export interface ModelRankingsSnapshot {
  history: ModelRankingHistoryPoint[];
  items: ModelRankingItem[];
  source: ModelRankingsSource;
}
