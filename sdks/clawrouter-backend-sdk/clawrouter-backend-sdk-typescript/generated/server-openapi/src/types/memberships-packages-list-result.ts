import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Memberships packages list result schema exposed by Claw Router. */
export interface MembershipsPackagesListResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships packages list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
