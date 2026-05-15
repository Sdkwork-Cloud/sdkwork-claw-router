import type { CommerceOperationResponse } from './commerce-operation-response';

/** Wallet withdrawals create result schema exposed by Claw Router. */
export interface WalletWithdrawalsCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet withdrawals create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
