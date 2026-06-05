import type { CommerceInventoryLedgerItem } from './commerce-inventory-ledger-item';

/** Commerce inventory ledger list response schema exposed by Claw Router. */
export interface CommerceInventoryLedgerListResponse {
  /** Items field on commerce inventory ledger list response. */
  items: CommerceInventoryLedgerItem[];
  /** Page field on commerce inventory ledger list response. */
  page: string;
  /** Page size field on commerce inventory ledger list response. */
  pageSize: string;
  /** Total field on commerce inventory ledger list response. */
  total: string;
}
