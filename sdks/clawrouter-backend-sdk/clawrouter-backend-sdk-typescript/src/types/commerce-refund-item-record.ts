/** Commerce refund item record schema exposed by Claw Router. */
export interface CommerceRefundItemRecord {
  /** Created at field on commerce refund item record. */
  created_at: string;
  /** Order item id field on commerce refund item record. */
  order_item_id: string;
  /** Organization id field on commerce refund item record. */
  organization_id?: string;
  /** Refund amount field on commerce refund item record. */
  refund_amount: string;
  /** Refund id field on commerce refund item record. */
  refund_id: string;
  /** Tenant id field on commerce refund item record. */
  tenant_id: string;
}
