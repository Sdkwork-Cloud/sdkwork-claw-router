import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships packages update result schema exposed by Claw Router. */
export interface MembershipsPackagesUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships packages update result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
