/** Commerce inventory stock item schema exposed by Claw Router. */
export interface CommerceInventoryStockItem {
  /** Available quantity field on commerce inventory stock item. */
  availableQuantity: number;
  /** Created at field on commerce inventory stock item. */
  createdAt: string;
  /** Id field on commerce inventory stock item. */
  id: string;
  /** Reserved quantity field on commerce inventory stock item. */
  reservedQuantity: number;
  /** Sku id field on commerce inventory stock item. */
  skuId: string;
  /** Sold quantity field on commerce inventory stock item. */
  soldQuantity: number;
  /** Status field on commerce inventory stock item. */
  status: 'active' | 'inactive' | 'locked';
  /** Updated at field on commerce inventory stock item. */
  updatedAt: string;
  /** Version field on commerce inventory stock item. */
  version: number;
  /** Warehouse id field on commerce inventory stock item. */
  warehouseId?: string | null;
}
