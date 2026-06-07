import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships plans create result schema exposed by Claw Router. */
export interface MembershipsPlansCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships plans create result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
