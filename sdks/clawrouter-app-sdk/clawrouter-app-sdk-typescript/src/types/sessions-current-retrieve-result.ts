import type { IamSessionResponse } from './iam-session-response';

/** Sessions current retrieve result schema exposed by Claw Router. */
export interface SessionsCurrentRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on sessions current retrieve result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
