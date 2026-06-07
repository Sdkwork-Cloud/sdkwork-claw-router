import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships package groups create result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups create result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
