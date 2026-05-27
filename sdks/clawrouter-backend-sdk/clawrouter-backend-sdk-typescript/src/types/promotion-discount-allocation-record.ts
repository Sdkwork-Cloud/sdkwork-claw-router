/** Promotion discount allocation record schema exposed by Claw Router. */
export interface PromotionDiscountAllocationRecord {
  /** Allocation ratio bps field on promotion discount allocation record. */
  allocation_ratio_bps?: number;
  /** Application id field on promotion discount allocation record. */
  application_id: string;
  /** Created at field on promotion discount allocation record. */
  created_at: string;
  /** Currency code field on promotion discount allocation record. */
  currency_code: string;
  /** Order id field on promotion discount allocation record. */
  order_id: string;
  /** Order item id field on promotion discount allocation record. */
  order_item_id?: string;
  /** Organization id field on promotion discount allocation record. */
  organization_id?: string;
  /** Sku id field on promotion discount allocation record. */
  sku_id?: string;
  /** Tenant id field on promotion discount allocation record. */
  tenant_id: string;
}
