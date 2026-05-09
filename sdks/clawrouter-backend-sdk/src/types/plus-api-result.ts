import type { OperationResponse } from './operation-response';

export interface PlusApiResult {
  /** Business response code. */
  code?: string;
  data?: OperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
