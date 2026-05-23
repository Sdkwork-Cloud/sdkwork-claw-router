import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships package groups retrieve result schema exposed by Claw Router. */
export interface MembershipsPackageGroupsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships package groups retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
