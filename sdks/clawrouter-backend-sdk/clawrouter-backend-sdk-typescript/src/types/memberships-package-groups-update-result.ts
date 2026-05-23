import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships package groups update result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups update result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
