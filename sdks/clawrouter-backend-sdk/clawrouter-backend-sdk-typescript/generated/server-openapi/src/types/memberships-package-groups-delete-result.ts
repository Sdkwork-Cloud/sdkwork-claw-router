import type { AdminDeleteResponse } from './admin-delete-response';

/** Memberships package groups delete result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
