import type { CommerceOperationResponse } from './commerce-operation-response';

/** Refunds create result schema exposed by Claw Router. */
export interface RefundsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on refunds create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
