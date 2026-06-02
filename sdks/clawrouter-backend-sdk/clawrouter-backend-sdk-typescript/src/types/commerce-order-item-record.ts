/** Commerce order item record schema exposed by Claw Router. */
export interface CommerceOrderItemRecord {
  /** Created at field on commerce order item record. */
  created_at: string;
  /** Id field on commerce order item record. */
  id?: string;
  /** Order id field on commerce order item record. */
  order_id: string;
  /** Quantity field on commerce order item record. */
  quantity: string;
  /** Sku id field on commerce order item record. */
  sku_id: string;
  /** Tenant id field on commerce order item record. */
  tenant_id: string;
  /** Title field on commerce order item record. */
  title: string;
  /** Total amount field on commerce order item record. */
  total_amount: string;
  /** Unit price amount field on commerce order item record. */
  unit_price_amount: string;
}
