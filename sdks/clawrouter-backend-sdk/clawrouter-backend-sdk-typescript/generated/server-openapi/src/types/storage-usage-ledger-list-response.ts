import type { StorageUsageLedgerEntry } from './storage-usage-ledger-entry';

/** Storage usage ledger list response schema exposed by Claw Router. */
export interface StorageUsageLedgerListResponse {
  /** Items field on storage usage ledger list response. */
  items: StorageUsageLedgerEntry[];
  /** Next cursor field on storage usage ledger list response. */
  nextCursor?: string;
  /** Request id field on storage usage ledger list response. */
  requestId: string;
}
