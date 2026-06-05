import type { CommerceInventoryStockItem } from './commerce-inventory-stock-item';

/** Commerce inventory stock list response schema exposed by Claw Router. */
export interface CommerceInventoryStockListResponse {
  /** Items field on commerce inventory stock list response. */
  items: CommerceInventoryStockItem[];
  /** Page field on commerce inventory stock list response. */
  page: string;
  /** Page size field on commerce inventory stock list response. */
  pageSize: string;
  /** Total field on commerce inventory stock list response. */
  total: string;
}
