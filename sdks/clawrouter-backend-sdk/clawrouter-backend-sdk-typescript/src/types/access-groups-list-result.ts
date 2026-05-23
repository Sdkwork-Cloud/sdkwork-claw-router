import type { AdminAccessGroupsResponse } from './admin-access-groups-response';

/** Access groups list result schema exposed by Claw Router. */
export interface AccessGroupsListResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups list result. */
  data?: AdminAccessGroupsResponse;
  /** Human-readable response message. */
  msg?: string;
}
