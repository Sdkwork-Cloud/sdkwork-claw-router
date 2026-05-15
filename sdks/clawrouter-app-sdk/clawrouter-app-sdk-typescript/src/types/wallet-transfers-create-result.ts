import type { CommerceOperationResponse } from './commerce-operation-response';

/** Wallet transfers create result schema exposed by Claw Router. */
export interface WalletTransfersCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet transfers create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
