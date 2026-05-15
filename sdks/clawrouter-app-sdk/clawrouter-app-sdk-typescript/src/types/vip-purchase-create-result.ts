import type { CommerceOperationResponse } from './commerce-operation-response';

/** Vip purchase create result schema exposed by Claw Router. */
export interface VipPurchaseCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on vip purchase create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
