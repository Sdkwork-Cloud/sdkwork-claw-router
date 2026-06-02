/** Commerce refund item record schema exposed by Claw Router. */
export interface CommerceRefundItemRecord {
  /** Created at field on commerce refund item record. */
  created_at: string;
  /** Id field on commerce refund item record. */
  id?: string;
  /** Order item id field on commerce refund item record. */
  order_item_id: string;
  /** Organization id field on commerce refund item record. */
  organization_id?: string;
  /** Quantity field on commerce refund item record. */
  quantity: string;
  /** Refund amount field on commerce refund item record. */
  refund_amount: string;
  /** Refund id field on commerce refund item record. */
  refund_id: string;
  /** Shipping refund amount field on commerce refund item record. */
  shipping_refund_amount: string;
  /** Tax refund amount field on commerce refund item record. */
  tax_refund_amount: string;
  /** Tenant id field on commerce refund item record. */
  tenant_id: string;
}
