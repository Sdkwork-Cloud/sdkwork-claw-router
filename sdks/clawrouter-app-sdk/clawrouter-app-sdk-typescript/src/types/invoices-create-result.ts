import type { CommerceOperationResponse } from './commerce-operation-response';

/** Invoices create result schema exposed by Claw Router. */
export interface InvoicesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on invoices create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
