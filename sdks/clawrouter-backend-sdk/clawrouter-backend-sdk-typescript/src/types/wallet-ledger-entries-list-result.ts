import type { CommerceStandardCollectionResponse } from './commerce-standard-collection-response';

/** Wallet ledger entries list result schema exposed by Claw Router. */
export interface WalletLedgerEntriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet ledger entries list result. */
  data?: CommerceStandardCollectionResponse;
  /** Human-readable response message. */
  msg?: string;
}
