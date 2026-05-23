import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Invoices list result schema exposed by Claw Router. */
export interface InvoicesListResult {
  /** Business response code. */
  code: string;
  /** Data field on invoices list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
