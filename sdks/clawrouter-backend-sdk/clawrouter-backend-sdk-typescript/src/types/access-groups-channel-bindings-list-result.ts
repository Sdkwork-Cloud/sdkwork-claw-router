import type { AdminAccessGroupChannelBindingsResponse } from './admin-access-group-channel-bindings-response';

/** Access groups channel bindings list result schema exposed by Claw Router. */
export interface AccessGroupsChannelBindingsListResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups channel bindings list result. */
  data?: AdminAccessGroupChannelBindingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
