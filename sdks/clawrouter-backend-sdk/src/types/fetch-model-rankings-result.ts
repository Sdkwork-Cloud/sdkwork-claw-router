import type { ModelRankingsSnapshot } from './model-rankings-snapshot';

export interface FetchModelRankingsResult {
  /** Business response code. */
  code: string;
  data?: ModelRankingsSnapshot;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
