import type { CommerceInventoryLedgerListResponse } from './commerce-inventory-ledger-list-response';

/** Inventory ledger entries list result schema exposed by Claw Router. */
export interface InventoryLedgerEntriesListResult {
  /** Business response code. */
  code: string;
  /** Data field on inventory ledger entries list result. */
  data?: CommerceInventoryLedgerListResponse;
  /** Human-readable response message. */
  msg?: string;
}
