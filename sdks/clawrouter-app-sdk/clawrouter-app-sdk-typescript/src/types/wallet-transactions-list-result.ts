import type { CommerceWalletTransactionsResponse } from './commerce-wallet-transactions-response';

/** Wallet transactions list result schema exposed by Claw Router. */
export interface WalletTransactionsListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet transactions list result. */
  data?: CommerceWalletTransactionsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
