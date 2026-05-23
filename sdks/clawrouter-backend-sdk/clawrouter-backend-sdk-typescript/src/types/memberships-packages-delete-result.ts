import type { AdminDeleteResponse } from './admin-delete-response';

/** Memberships packages delete result schema exposed by Claw Router. */
export interface MembershipsPackagesDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships packages delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
