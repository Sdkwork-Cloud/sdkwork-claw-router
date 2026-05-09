import type { AdminAppMutationResponse } from './admin-app-mutation-response';

export interface FetchAppResult {
  /** Business response code. */
  code: string;
  data?: AdminAppMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
