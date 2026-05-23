import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Refunds retrieve result schema exposed by Claw Router. */
export interface RefundsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on refunds retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
