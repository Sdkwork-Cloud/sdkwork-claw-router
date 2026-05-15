import type { AdminDeleteResponse } from './admin-delete-response';

/** Access groups delete result schema exposed by Claw Router. */
export interface AccessGroupsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
