import type { JsonValue } from './json-value';

/** Storage usage ledger entry schema exposed by Claw Router. */
export interface StorageUsageLedgerEntry {
  /** Delta bytes field on storage usage ledger entry. */
  deltaBytes?: string;
  /** Id field on storage usage ledger entry. */
  id: string;
  /** Occurred at field on storage usage ledger entry. */
  occurredAt?: string;
  /** Scope id field on storage usage ledger entry. */
  scopeId?: string;
  /** Scope type field on storage usage ledger entry. */
  scopeType?: string;
}
