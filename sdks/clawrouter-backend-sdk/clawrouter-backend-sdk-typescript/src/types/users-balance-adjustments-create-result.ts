import type { AdminUserMutationResponse } from './admin-user-mutation-response';

/** Users balance adjustments create result schema exposed by Claw Router. */
export interface UsersBalanceAdjustmentsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on users balance adjustments create result. */
  data?: AdminUserMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
