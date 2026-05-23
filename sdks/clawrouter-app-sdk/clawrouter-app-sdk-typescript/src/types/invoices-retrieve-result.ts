import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Invoices retrieve result schema exposed by Claw Router. */
export interface InvoicesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on invoices retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
