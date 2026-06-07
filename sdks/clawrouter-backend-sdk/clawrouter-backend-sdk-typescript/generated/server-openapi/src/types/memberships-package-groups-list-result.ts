import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships package groups list result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
