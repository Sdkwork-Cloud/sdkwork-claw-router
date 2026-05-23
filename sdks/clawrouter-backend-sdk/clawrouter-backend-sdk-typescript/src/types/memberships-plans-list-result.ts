import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships plans list result schema exposed by Claw Router. */
export interface MembershipsPlansListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships plans list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
