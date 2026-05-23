import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships current status retrieve result schema exposed by Claw Router. */
export interface MembershipsCurrentStatusRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships current status retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
