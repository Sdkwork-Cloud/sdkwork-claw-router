import type { AdminAccessGroupChannelBindingsResponse } from './admin-access-group-channel-bindings-response';

/** Access groups channel bindings update result schema exposed by Claw Router. */
export interface AccessGroupsChannelBindingsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on access groups channel bindings update result. */
  data?: AdminAccessGroupChannelBindingsResponse;
  /** Human-readable response message. */
  msg?: string;
}
