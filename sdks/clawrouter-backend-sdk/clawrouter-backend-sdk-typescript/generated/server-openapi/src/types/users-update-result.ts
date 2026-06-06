import type { AdminUserMutationResponse } from './admin-user-mutation-response';

/** Users update result schema exposed by Claw Router. */
export interface UsersUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on users update result. */
  data?: AdminUserMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
