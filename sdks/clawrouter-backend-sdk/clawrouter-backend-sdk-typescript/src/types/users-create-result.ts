import type { AdminUserMutationResponse } from './admin-user-mutation-response';

/** Users create result schema exposed by Claw Router. */
export interface UsersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on users create result. */
  data?: AdminUserMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
