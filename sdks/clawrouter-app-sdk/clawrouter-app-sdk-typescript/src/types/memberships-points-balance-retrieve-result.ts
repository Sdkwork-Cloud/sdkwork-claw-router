import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships points balance retrieve result schema exposed by Claw Router. */
export interface MembershipsPointsBalanceRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships points balance retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
