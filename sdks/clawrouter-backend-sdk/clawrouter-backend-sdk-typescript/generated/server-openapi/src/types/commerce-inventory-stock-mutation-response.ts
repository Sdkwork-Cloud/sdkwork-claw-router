import type { CommerceInventoryStockItem } from './commerce-inventory-stock-item';

/** Commerce inventory stock mutation response schema exposed by Claw Router. */
export interface CommerceInventoryStockMutationResponse {
  /** Item field on commerce inventory stock mutation response. */
  item: CommerceInventoryStockItem;
}
