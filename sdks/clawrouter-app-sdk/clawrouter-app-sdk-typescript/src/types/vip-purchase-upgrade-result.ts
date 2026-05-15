import type { CommerceOperationResponse } from './commerce-operation-response';

/** Vip purchase upgrade result schema exposed by Claw Router. */
export interface VipPurchaseUpgradeResult {
  /** Business response code. */
  code: string;
  /** Data field on vip purchase upgrade result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
