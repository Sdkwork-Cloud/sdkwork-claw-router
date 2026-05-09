import type { ModelRankingRefreshTriggerResponse } from './model-ranking-refresh-trigger-response';

export interface TriggerModelRankingRefreshResult {
  /** Business response code. */
  code: string;
  data?: ModelRankingRefreshTriggerResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
