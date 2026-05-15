import type { IamUserResponse } from './iam-user-response';

/** Users current retrieve result schema exposed by Claw Router. */
export interface UsersCurrentRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on users current retrieve result. */
  data?: IamUserResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
