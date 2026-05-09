import type { GenerationHistoryResponse } from './generation-history-response';

export interface FetchGenerationHistoryResult {
  /** Business response code. */
  code: string;
  data?: GenerationHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
