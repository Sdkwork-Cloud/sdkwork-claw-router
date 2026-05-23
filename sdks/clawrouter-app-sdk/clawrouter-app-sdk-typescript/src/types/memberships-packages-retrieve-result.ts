import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships packages retrieve result schema exposed by Claw Router. */
export interface MembershipsPackagesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships packages retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
