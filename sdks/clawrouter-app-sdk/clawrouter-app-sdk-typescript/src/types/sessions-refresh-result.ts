import type { IamSessionResponse } from './iam-session-response';

/** Sessions refresh result schema exposed by Claw Router. */
export interface SessionsRefreshResult {
  /** Business response code. */
  code: string;
  /** Data field on sessions refresh result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
