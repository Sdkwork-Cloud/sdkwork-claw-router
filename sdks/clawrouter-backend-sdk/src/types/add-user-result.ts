import type { AdminUserMutationResponse } from './admin-user-mutation-response';

export interface AddUserResult {
  /** Business response code. */
  code: string;
  data?: AdminUserMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
