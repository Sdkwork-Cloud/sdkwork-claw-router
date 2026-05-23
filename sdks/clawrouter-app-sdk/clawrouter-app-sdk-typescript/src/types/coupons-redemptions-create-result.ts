import type { CommerceOperationResponse } from './commerce-operation-response';

/** Coupons redemptions create result schema exposed by Claw Router. */
export interface CouponsRedemptionsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on coupons redemptions create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  msg?: string;
}
