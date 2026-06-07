import type { AdminDeleteResponse } from './admin-delete-response';

/** Memberships plans delete result schema exposed by Claw Router. */
export interface MembershipsPlansDeleteResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships plans delete result. */
  data?: AdminDeleteResponse;
  /** Human-readable response message. */
  msg?: string;
}
