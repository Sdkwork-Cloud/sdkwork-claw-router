import type { CommerceOperationResponse } from './commerce-operation-response';

/** Memberships privileges speed ups create result schema exposed by Claw Router. */
export interface MembershipsPrivilegesSpeedUpsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships privileges speed ups create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
