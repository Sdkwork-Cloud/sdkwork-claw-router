import type { AdminAccessGroupMutationResponse } from './admin-access-group-mutation-response';

/** Access groups update result schema exposed by Claw Router. */
export interface AccessGroupsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups update result. */
  data?: AdminAccessGroupMutationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
