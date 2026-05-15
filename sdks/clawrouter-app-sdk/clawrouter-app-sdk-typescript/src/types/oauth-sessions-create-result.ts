import type { IamSessionResponse } from './iam-session-response';

/** Oauth sessions create result schema exposed by Claw Router. */
export interface OauthSessionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on oauth sessions create result. */
  data?: IamSessionResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
