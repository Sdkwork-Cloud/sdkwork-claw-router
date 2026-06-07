import type { CommerceInventoryStockListResponse } from './commerce-inventory-stock-list-response';

/** Inventory stocks list result schema exposed by Claw Router. */
export interface InventoryStocksListResult {
  /** Business response code. */
  code: string;
  /** Data field on inventory stocks list result. */
  data?: CommerceInventoryStockListResponse;
  /** Human-readable response message. */
  msg?: string;
}
