import type { AdminUsersResponse } from './admin-users-response';

/** Users list result schema exposed by Claw Router. */
export interface UsersListResult {
  /** Business response code. */
  code: string;
  /** Data field on users list result. */
  data?: AdminUsersResponse;
  /** Human-readable response message. */
  msg?: string;
}
