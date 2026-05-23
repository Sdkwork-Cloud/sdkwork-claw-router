import type { AdminAccessGroupMutationResponse } from './admin-access-group-mutation-response';

/** Access groups create result schema exposed by Claw Router. */
export interface AccessGroupsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups create result. */
  data?: AdminAccessGroupMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
