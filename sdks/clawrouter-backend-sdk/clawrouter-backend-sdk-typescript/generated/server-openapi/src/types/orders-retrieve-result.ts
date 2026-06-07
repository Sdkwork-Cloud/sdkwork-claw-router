import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Orders retrieve result schema exposed by Claw Router. */
export interface OrdersRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on orders retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
