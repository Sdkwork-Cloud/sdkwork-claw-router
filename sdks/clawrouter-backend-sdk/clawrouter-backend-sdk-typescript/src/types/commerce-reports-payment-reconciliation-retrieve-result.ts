import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Commerce reports payment reconciliation retrieve result schema exposed by Claw Router. */
export interface CommerceReportsPaymentReconciliationRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on commerce reports payment reconciliation retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
