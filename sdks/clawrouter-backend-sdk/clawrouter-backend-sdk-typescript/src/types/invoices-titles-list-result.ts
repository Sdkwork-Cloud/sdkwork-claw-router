import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Invoices titles list result schema exposed by Claw Router. */
export interface InvoicesTitlesListResult {
  /** Business response code. */
  code: string;
  /** Data field on invoices titles list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
