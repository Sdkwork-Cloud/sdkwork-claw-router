import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Wallet accounts list result schema exposed by Claw Router. */
export interface WalletAccountsListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet accounts list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
