import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships package groups packages list result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups packages list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
