import type { CommerceStandardResourceResponse } from './commerce-standard-resource-response';

/** Wallet ledger entries retrieve result schema exposed by Claw Router. */
export interface WalletLedgerEntriesRetrieveResult {
  /** Business response code. */
  code: string;
  /** Data field on wallet ledger entries retrieve result. */
  data?: CommerceStandardResourceResponse;
  /** Human-readable response message. */
  msg?: string;
}
