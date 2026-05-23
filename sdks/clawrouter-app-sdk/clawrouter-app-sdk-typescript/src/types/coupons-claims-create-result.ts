import type { CommerceOperationResponse } from './commerce-operation-response';

/** Coupons claims create result schema exposed by Claw Router. */
export interface CouponsClaimsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons claims create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
