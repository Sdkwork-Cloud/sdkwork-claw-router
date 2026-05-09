import type { ModelRankingRefreshJobHistoryPage } from './model-ranking-refresh-job-history-page';

export interface FetchModelRankingRefreshJobsResult {
  /** Business response code. */
  code: string;
  data?: ModelRankingRefreshJobHistoryPage;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
