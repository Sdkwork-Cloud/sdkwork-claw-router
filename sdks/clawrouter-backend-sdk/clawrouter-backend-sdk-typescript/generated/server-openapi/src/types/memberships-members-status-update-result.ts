import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships members status update result schema exposed by Claw Router. */
export interface MembershipsMembersStatusUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships members status update result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
