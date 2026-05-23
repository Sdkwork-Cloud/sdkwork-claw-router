import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Memberships current retrieve result schema exposed by Claw Router. */
export interface MembershipsCurrentRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on memberships current retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
