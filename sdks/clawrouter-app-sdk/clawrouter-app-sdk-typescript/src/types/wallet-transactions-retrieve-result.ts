import type { CommerceWalletTransactionItem } from './commerce-wallet-transaction-item';

/** Wallet transactions retrieve result schema exposed by Claw Router. */
export interface WalletTransactionsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet transactions retrieve result. */
  data?: CommerceWalletTransactionItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
