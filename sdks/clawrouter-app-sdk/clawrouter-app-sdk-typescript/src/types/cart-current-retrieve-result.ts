import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Cart current retrieve result schema exposed by Claw Router. */
export interface CartCurrentRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on cart current retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
