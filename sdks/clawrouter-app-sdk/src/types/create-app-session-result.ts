import type { AppSessionCreateResponse } from './app-session-create-response';

export interface CreateAppSessionResult {
  /** Business response code. */
  code: string;
  data?: AppSessionCreateResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
