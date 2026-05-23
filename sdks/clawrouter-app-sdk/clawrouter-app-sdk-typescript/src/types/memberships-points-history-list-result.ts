import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships points history list result schema exposed by Claw Router. */
export interface MembershipsPointsHistoryListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships points history list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
