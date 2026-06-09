/** Commerce inventory ledger item schema exposed by Claw Router. */
export interface CommerceInventoryLedgerItem {
  /** Balance after field on commerce inventory ledger item. */
  balanceAfter: string;
  /** Business type field on commerce inventory ledger item. */
  businessType: string;
  /** Created at field on commerce inventory ledger item. */
  createdAt: string;
  /** Direction field on commerce inventory ledger item. */
  direction: 'in' | 'out' | 'reserve' | 'release' | 'deduct';
  /** Id field on commerce inventory ledger item. */
  id: string;
  /** Movement no field on commerce inventory ledger item. */
  movementNo: string;
  /** Quantity field on commerce inventory ledger item. */
  quantity: string;
  /** Sku id field on commerce inventory ledger item. */
  skuId: string;
  /** Source id field on commerce inventory ledger item. */
  sourceId: string;
  /** Source type field on commerce inventory ledger item. */
  sourceType: string;
  /** Warehouse id field on commerce inventory ledger item. */
  warehouseId?: string | null;
}
