import type { ModelRankingHistoryEntry } from './model-ranking-history-entry';

export interface ModelRankingHistoryPoint {
  date: string;
  entries: ModelRankingHistoryEntry[];
  index: number;
}
