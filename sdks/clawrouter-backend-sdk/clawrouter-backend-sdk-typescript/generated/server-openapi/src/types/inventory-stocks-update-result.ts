import type { CommerceInventoryStockMutationResponse } from './commerce-inventory-stock-mutation-response';

/** Inventory stocks update result schema exposed by Claw Router. */
export interface InventoryStocksUpdateResult {
  /** Business response code. */
  code: string;
  /** Data field on inventory stocks update result. */
  data?: CommerceInventoryStockMutationResponse;
  /** Human-readable response message. */
  msg?: string;
}
