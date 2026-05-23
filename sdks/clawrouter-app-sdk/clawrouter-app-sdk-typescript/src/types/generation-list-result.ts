import type { GenerationHistoryResponse } from './generation-history-response';

/** Generation list result schema exposed by Claw Router. */
export interface GenerationListResult {
  /** Business response code. */
  code: string;
  /** Data field on generation list result. */
  data?: GenerationHistoryResponse;
  /** Human-readable response message. */
  msg?: string;
}
