import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships privileges usage retrieve result schema exposed by Claw Router. */
export interface MembershipsPrivilegesUsageRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships privileges usage retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
