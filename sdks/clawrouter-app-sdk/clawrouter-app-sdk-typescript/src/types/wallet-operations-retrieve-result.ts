import type { CommerceWalletTransactionItem } from './commerce-wallet-transaction-item';

/** Wallet operations retrieve result schema exposed by Claw Router. */
export interface WalletOperationsRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet operations retrieve result. */
  data?: CommerceWalletTransactionItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
