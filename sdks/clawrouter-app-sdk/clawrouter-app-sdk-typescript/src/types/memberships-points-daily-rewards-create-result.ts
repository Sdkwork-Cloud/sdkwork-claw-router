import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships points daily rewards create result schema exposed by Claw Router. */
export interface MembershipsPointsDailyRewardsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships points daily rewards create result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
