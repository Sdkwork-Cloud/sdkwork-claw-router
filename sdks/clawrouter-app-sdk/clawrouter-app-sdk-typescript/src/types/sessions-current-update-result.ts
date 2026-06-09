import type { IamSessionResponse } from './iam-session-response';

/** Sessions current update result schema exposed by Claw Router. */
export interface SessionsCurrentUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on sessions current update result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  msg?: string;
}
