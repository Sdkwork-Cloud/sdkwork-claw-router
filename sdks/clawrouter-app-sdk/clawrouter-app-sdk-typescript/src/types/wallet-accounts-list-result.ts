import type { CommerceWalletAccountsResponse } from './commerce-wallet-accounts-response';

/** Wallet accounts list result schema exposed by Claw Router. */
export interface WalletAccountsListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet accounts list result. */
  data?: CommerceWalletAccountsResponse;
  /** Human-readable response message. */
  message?: string;
  /** Java-compatible response message field. */
  msg?: string;
}
