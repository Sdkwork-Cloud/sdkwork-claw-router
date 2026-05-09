export interface UsageLogItem {
  baseInputPrice: string;
  baseOutputPrice: string;
  cacheReadPrice: string;
  cacheReadTokens: number;
  cost: string;
  group: string;
  id: string;
  inputTokens: number;
  ip: string;
  isStream: boolean;
  model: string;
  multiplier: string;
  outputTokens: number;
  path: string;
  reasoningEffort: string;
  requestId: string;
  time: string;
  tokenName: string;
  totalTime: string;
  ttft: string;
  type: string;
}
