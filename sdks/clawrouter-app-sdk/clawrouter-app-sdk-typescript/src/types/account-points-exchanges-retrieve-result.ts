import type { CommerceWalletTransactionItem } from './commerce-wallet-transaction-item';

/** Account points exchanges retrieve result schema exposed by Claw Router. */
export interface AccountPointsExchangesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on account points exchanges retrieve result. */
  data?: CommerceWalletTransactionItem;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
