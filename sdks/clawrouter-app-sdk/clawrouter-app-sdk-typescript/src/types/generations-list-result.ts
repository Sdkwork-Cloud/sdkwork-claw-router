import type { GenerationHistoryResponse } from './generation-history-response';

/** Generations list result schema exposed by Claw Router. */
export interface GenerationsListResult {
  /** Business response code. */
  code: string;
  /** Data field on generations list result. */
  data?: GenerationHistoryResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
