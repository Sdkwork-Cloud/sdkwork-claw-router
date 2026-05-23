import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships benefits list result schema exposed by Claw Router. */
export interface MembershipsBenefitsListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships benefits list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
