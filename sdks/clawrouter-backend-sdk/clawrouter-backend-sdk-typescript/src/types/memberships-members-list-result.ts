import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships members list result schema exposed by Claw Router. */
export interface MembershipsMembersListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships members list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
