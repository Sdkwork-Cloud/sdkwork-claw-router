import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships points daily rewards status retrieve result schema exposed by Claw Router. */
export interface MembershipsPointsDailyRewardsStatusRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships points daily rewards status retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
