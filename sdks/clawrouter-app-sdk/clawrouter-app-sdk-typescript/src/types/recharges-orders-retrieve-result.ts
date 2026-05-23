import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Recharges orders retrieve result schema exposed by Claw Router. */
export interface RechargesOrdersRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on recharges orders retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
