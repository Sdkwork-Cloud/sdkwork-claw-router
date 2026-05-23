import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships plans update result schema exposed by Claw Router. */
export interface MembershipsPlansUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships plans update result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
