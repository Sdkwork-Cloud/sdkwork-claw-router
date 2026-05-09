export interface ModelRankingItem {
  baseVolume: number;
  color: string;
  contextSize?: string | null;
  cost: number;
  costIndicator: number;
  currency: string;
  /** Stable model catalog identity; must match ranking history catalogKey and must not include snapshot date prefixes. */
  id: string;
  isNew: boolean;
  latency: number;
  license?: 'Open Source' | 'Proprietary' | null;
  modality: 'LLM' | 'Image' | 'Audio' | 'Video' | 'Music' | 'Embedding' | 'Rerank' | 'Unknown';
  name: string;
  prevRank: number;
  pricing?: string | null;
  rank: number;
  requests: number;
  strengths: string[];
  tokens: number;
  trendScore?: number | null;
  vendor: string;
  vendorCode: string;
  winRate?: number | null;
}
