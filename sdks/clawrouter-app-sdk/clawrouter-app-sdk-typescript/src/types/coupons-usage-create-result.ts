import type { CommerceOperationResponse } from './commerce-operation-response';

/** Coupons usage create result schema exposed by Claw Router. */
export interface CouponsUsageCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons usage create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
