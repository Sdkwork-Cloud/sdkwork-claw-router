import type { CommerceOperationResponse } from './commerce-operation-response';

/** Vip purchase renew result schema exposed by Claw Router. */
export interface VipPurchaseRenewResult {
  /** Business response code. */
  code: string;
  /** Data field on vip purchase renew result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
