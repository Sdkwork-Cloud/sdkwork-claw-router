import type { IamSessionResponse } from './iam-session-response';

/** Sessions create result schema exposed by Claw Router. */
export interface SessionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on sessions create result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
