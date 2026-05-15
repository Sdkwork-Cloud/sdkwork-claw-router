import type { CommerceOperationResponse } from './commerce-operation-response';

/** Account tokens deductions create result schema exposed by Claw Router. */
export interface AccountTokensDeductionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on account tokens deductions create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
