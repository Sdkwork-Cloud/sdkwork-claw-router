import type { CommerceOperationResponse } from './commerce-operation-response';

/** Wallet exchanges create result schema exposed by Claw Router. */
export interface WalletExchangesCreateResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet exchanges create result. */
  data?: CommerceOperationResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
