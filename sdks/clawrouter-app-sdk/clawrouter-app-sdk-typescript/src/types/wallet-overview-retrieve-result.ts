import type { CommerceWalletOverviewResponse } from './commerce-wallet-overview-response';

/** Wallet overview retrieve result schema exposed by Claw Router. */
export interface WalletOverviewRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet overview retrieve result. */
  data?: CommerceWalletOverviewResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
