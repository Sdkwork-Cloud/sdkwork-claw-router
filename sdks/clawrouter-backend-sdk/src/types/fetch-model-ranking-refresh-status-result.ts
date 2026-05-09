import type { ModelRankingRefreshStatus } from './model-ranking-refresh-status';

export interface FetchModelRankingRefreshStatusResult {
  /** Business response code. */
  code: string;
  data?: ModelRankingRefreshStatus;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
